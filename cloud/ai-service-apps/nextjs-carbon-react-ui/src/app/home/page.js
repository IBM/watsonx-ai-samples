"use client";

import { Button, Loading } from "@carbon/react";
import { useState, useContext, useRef, useCallback } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { DeploymentContext } from "../../contexts/deployment-context";
import _get from "lodash/get";

import QAPanel from "../../components/QAPanel/QAPanel";
import { MESSAGE_ROLE, MESSAGE_STATUS } from "@/utils/constants";

export default function LandingPage() {
  const deployment = useContext(DeploymentContext);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const shouldAutoScrollRef = useRef(true);
  const autoScrollIntersectorRef = useRef(null);
  const controllerRef = useRef(null);

  // useChatAutoScrollDetector(autoScrollIntersectorRef, shouldAutoScrollRef);

  const _getResponse = async (messages, reply, updateFn) => {
    const payload = {
      messages,
    };

    return new Promise((resolve, reject) => {
      let content = "";

      reply.plan = {
        steps: [
          {
            state: "thinking",
          },
        ],
      };
      updateFn();

      fetchEventSource("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        signal: controllerRef.current.signal,
        body: JSON.stringify(payload),
        openWhenHidden: true,
        async onopen(response) {
          if (response.status !== 200) {
            reject(await response.json());
          }
        },
        onmessage(event) {
          if (!event.data) {
            return;
          }
          let parsedData = null;

          try {
            parsedData = JSON.parse(event.data);
          } catch (err) {
            return reject(err);
          }

          if (parsedData.errors && Array.isArray(parsedData.errors) && parsedData.errors[0]) {
            const error = parsedData.errors[0];
            const errorData = error.messageId ? error : "Unknown generate error";
            reject(errorData);
          }

          let newContent = "";
          const message = _get(parsedData.choices[0], "message");
          const delta = _get(parsedData.choices[0], "delta");
          if (message) {
            // Support old format
            if (message.tool_calls || message.role === MESSAGE_ROLE.TOOL) {
              newContent = _processToolMessage(message);
            } else {
              newContent = _processDeltaLegacy(content, message.delta);
            }
          } else if (delta) {
            if (delta.tool_calls || delta.role === MESSAGE_ROLE.TOOL) {
              newContent = _processToolMessage(delta);
            } else {
              newContent = _processDelta(content, delta);
            }
          } else {
            newContent = null;
          }

          if (newContent) {
            // const codeBlockCounts = newContent.match(/```/gu);
            // const inCodeBlock = Boolean(codeBlockCounts && (codeBlockCounts.length % 2 !== 0));

            content = newContent;
            reply.content = content;
            updateFn();
            // answer.inCodeBlock = inCodeBlock;
          }
        },
        onclose() {
          resolve(content);
        },
        onerror(error) {
          reject(error);
        },
      });

      const _processToolMessage = (message) => {
        if (message.tool_calls) {
          // Tool start
          const id = message.tool_calls[0].id;
          const toolStart = message.tool_calls[0].function;
          const toolName = toolStart.name;
          const toolArguments = toolStart.arguments;
          let currentStep = reply.plan.steps[reply.plan.steps.length - 1];

          if (currentStep.state !== "thinking") {
            currentStep = {
              state: "thinking",
            };
            reply.plan.steps.push(currentStep);
          }
          currentStep.state = "started";
          currentStep.tool_name = toolName;
          currentStep.tool_input = toolArguments;
          currentStep.id = id;
          currentStep.definition = toolName; // We should really show input
          updateFn();
        } else if (message.role === "tool") {
          // Tool end
          const id = message.tool_call_id;
          for (const step of reply.plan.steps) {
            if (id === step.id && message.name === step.tool_name) {
              // Found it - update
              step.state = "finished";
              step.evidence = message.content;
              step.success = true;
              updateFn();
              break;
            }
          }
        }
        return null;
      };

      const _processDeltaLegacy = (oldContent, delta) => {
        if (!delta) {
          return null;
        }
        return `${oldContent}${delta}`;
      };

      const _processDelta = (oldContent, delta) => {
        if (!delta) {
          return null;
        }
        return `${oldContent}${delta.content}`;
      };
    });
  };

  const _ensureLastVisible = () => {
    setTimeout(() => {
      const element = document.getElementById("last-answer");
      const isEmptyAnswer = messages[0] && !messages[0].content;
      if (element && (shouldAutoScrollRef.current || isEmptyAnswer)) {
        element.scrollIntoView(false);
        // To reduce flicker as we replace rendered markdown over and over.
        element.style.minHeight = `${element.offsetHeight}px`;
      }
    }, 20);
  };

  const _updateLast = (messages) => {
    const newMessages = [...messages];
    setMessages(newMessages);
    _ensureLastVisible();
  };

  const _onInput = async (input) => {
    setIsGenerating(true);
    let newMessages = [...messages];
    controllerRef.current = new AbortController();
    const message = {
      role: MESSAGE_ROLE.USER,
      content: input,
      status: MESSAGE_STATUS.READY,
      timestamp: Date.now(),
    };
    newMessages.unshift(message);
    const reply = {
      role: MESSAGE_ROLE.ASSISTANT,
      content: "",
      status: MESSAGE_STATUS.LOADING,
      timestamp: Date.now(),
    };
    newMessages.unshift(reply);
    setMessages(newMessages);

    try {
      const response = await _getResponse(
        [...newMessages].reverse().slice(0, -1),
        reply,
        _updateLast.bind(null, newMessages)
      );
      reply.status = MESSAGE_STATUS.READY;
      reply.content = response;
      reply.timestamp = Date.now();
      const newMessages2 = [...newMessages];
      newMessages2[0] = reply;
      setMessages(newMessages2);
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
    }
  };

  const _onAbort = async () => {
    controllerRef.current.abort();
    setIsGenerating(false);
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      newMessages[0].aborted = true;
      newMessages[0].status = MESSAGE_STATUS.READY;
      return newMessages;
    });
    controllerRef.current = null;
  };

  const handleNewChat = useCallback(() => {
    setMessages([]);
    controllerRef.current?.abort();
    setIsGenerating(false);
    controllerRef.current = null;
  }, []);

  return (
    <div className="landing-page__container">
      {!deployment && <Loading />}
      {deployment && (
        <div className="landing-page__commandPanel">
          <Button onClick={handleNewChat}>New chat</Button>
        </div>
      )}
      {deployment && (
        <QAPanel
          messages={messages}
          onInput={_onInput}
          onAbort={_onAbort}
          intersectorRef={autoScrollIntersectorRef}
          isRunning={isGenerating}
        />
      )}
    </div>
  );
}
