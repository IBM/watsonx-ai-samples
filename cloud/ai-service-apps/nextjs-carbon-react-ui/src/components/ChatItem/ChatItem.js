"use client";

import { memo, useContext, useRef } from "react";
import * as Showdown from "showdown";
import cx from "classnames";
import { Transition } from "react-transition-group";
import { moderate01 } from "@carbon/motion";
import { Loading, Accordion, AccordionItem, DefinitionTooltip, CodeSnippet } from "@carbon/react";
import { CheckmarkFilled, CheckmarkFilledError } from "@carbon/react/icons";
import { DeploymentContext } from "../../contexts/deployment-context";
import { Avatar } from "../Avatar/Avatar";
import { MESSAGE_ROLE, MESSAGE_STATUS } from "@/utils/constants";
import { useAppContext } from "@/contexts/app-context";
import { getUserInitials, mapUserColor } from "@/utils/user-util";

const MESSAGE_ANIMATION_DURATION = parseInt(moderate01, 10);

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  smoothLivePreview: true,
  backslashEscapesHTMLTags: true,
  openLinksInNewWindow: true,
  emoji: true,
  metadata: true,
});

converter.setFlavor("github");
converter.setOption("smoothLivePreview", true);

const renderMarkdownToHTML = (markdown) => {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = converter.makeHtml(markdown);
  return { __html: renderedHTML };
};

const AnswerContent = ({ content, aborted }) => {
  if (typeof content === "string") {
    let markdown = content.trim();
    const triangle = aborted ? " :small_red_triangle:" : "";
    markdown += triangle;

    const markup = renderMarkdownToHTML(markdown);

    return <div className="preview-content-light" dangerouslySetInnerHTML={markup} />;
  }

  return content;
};

const ChatItem = memo(
  function ChatItem({ message, last }) {
    const deployment = useContext(DeploymentContext);
    const { userData } = useAppContext();
    const nodeRef = useRef(null);

    const _cleanToolInput = (input) => {
      try {
        if (input && input.includes('"__arg1"')) {
          // plain string input - extract
          const inputObject = JSON.parse(input);
          return inputObject.__arg1;
        }
      } catch (err) {
        console.error(err.message);
      }
      return input;
    };

    const _renderStepBody = (step) => (
      <div className="qa-panel__stepBody">
        {step.tool_name && (
          <div className="qa-panel__stepLabel">
            <span>Tool name:</span>
            <span>{step.tool_name}</span>
          </div>
        )}
        {step.tool_input && (
          <div className="qa-panel__stepLabel">
            <span>Tool input:</span>
            <span className="qa-panel__longValue">{_cleanToolInput(step.tool_input)}</span>
          </div>
        )}
        {step.evidence && (
          <CodeSnippet className="qa-panel__codeSnippet" type="multi" wrapText hideCopyButton>
            {step.evidence}
          </CodeSnippet>
        )}
      </div>
    );

    const _renderSteps = (steps) => (
      <Accordion align="start" size="sm" className="qa-panel__executionStatusDetails">
        {steps.map((step, idx) => (
          <AccordionItem
            key={`agent-plan:${step.id}`}
            className="qa-panel__executionStatusStep"
            disabled={!step.tool_name}
            title={
              <>
                <span className="qa-panel__stepIndex">{`${idx + 1}:`}</span>
                {step.state === "thinking" && (
                  <span className="qa-panel__stepTitle">Thinking...</span>
                )}
                {step.state !== "thinking" && (
                  <span className="qa-panel__stepTitle">
                    {_cleanToolInput(step.tool_input) || step.definition}
                  </span>
                )}
                {step.state !== "thinking" && (
                  <span
                    className={cx("qa-panel__stepNumber", {
                      ["started"]: step.state === "started",
                      ["finished"]: step.state === "finished",
                      ["loading"]: !step.tool_name,
                      ["success"]: step.success,
                    })}
                  >
                    {step.state === "finished" && step.success && <CheckmarkFilled size="16" />}
                    {step.state === "finished" && !step.success && (
                      <CheckmarkFilledError size="16" />
                    )}
                    {step.state === "started" && <Loading small withOverlay={false} />}
                  </span>
                )}
              </>
            }
          >
            {step.tool_name && _renderStepBody(step)}
          </AccordionItem>
        ))}
        <div className="qa-panel__lastStep">
          <DefinitionTooltip
            align="top"
            definition="An AI agent analyzes a prompt, searches for information using selected tools, and generates a response."
          >
            Steps created by Agent
          </DefinitionTooltip>
        </div>
      </Accordion>
    );

    const _renderReasoning = () => (
      <details className="qa-panel__reasoningSection">
        <summary>How did I get this answer?</summary>
        {_renderSteps(message.plan.steps)}
      </details>
    );

    let reasoning = null;

    if (
      last &&
      message.status === MESSAGE_STATUS.READY &&
      !message.aborted &&
      message.plan &&
      message.plan.steps
    ) {
      reasoning = _renderReasoning();
    }

    const isEmpty = message.status === MESSAGE_STATUS.LOADING && !message.content;
    const itemParentClass = cx("qa-panel__itemParent", {
      ["isInitial"]: message.initial,
    });
    let emptyContent = null;

    if (isEmpty) {
      if (message.plan && message.plan.steps) {
        emptyContent = _renderSteps(message.plan.steps);
      } else {
        emptyContent = <Loading withOverlay={false} small />;
      }
    }

    const itemId = last ? "last-answer" : message.timestamp;

    return (
      <Transition in appear nodeRef={nodeRef} timeout={MESSAGE_ANIMATION_DURATION}>
        {(state) => (
          <div ref={nodeRef} className={itemParentClass}>
            <div
              id={itemId}
              className={cx("qa-panel__chatItem", [`status-${state}`], {
                initial: message.initial,
              })}
            >
              {message.role === MESSAGE_ROLE.ASSISTANT && deployment && (
                <Avatar icon={deployment.avatar_icon} color={deployment.avatar_color} chat />
              )}
              {message.role === MESSAGE_ROLE.USER && (
                <div
                  className="qa-panel__userAvatar"
                  style={{ backgroundColor: mapUserColor(userData.name) }}
                >
                  {message.role === MESSAGE_ROLE.USER && getUserInitials(userData)}
                </div>
              )}
              <div className="qa-panel__itemContent">
                {emptyContent}
                {message.status === MESSAGE_STATUS.READY &&
                  message.role === MESSAGE_ROLE.USER &&
                  message.content}
                {!isEmpty && message.role === MESSAGE_ROLE.ASSISTANT && (
                  <AnswerContent content={message.content} aborted={message.aborted} />
                )}
                {reasoning}
              </div>
            </div>
          </div>
        )}
      </Transition>
    );
  },
  (oldProps, newProps) => {
    // Once message is ready, there is no need to re-render it.
    return (
      oldProps.message.status === MESSAGE_STATUS.READY &&
      newProps.message.status === MESSAGE_STATUS.READY &&
      oldProps.message.aborted !== newProps.message.aborted
    );
  }
);

export default ChatItem;
