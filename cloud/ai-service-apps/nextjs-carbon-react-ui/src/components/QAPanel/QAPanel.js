"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Button } from "@carbon/react";
import { StopOutline, Send } from "@carbon/react/icons";
import { TextNode } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import InitialMessage from "../InitialMessage/InitialMessage";
import InputPlugin from "../InputPlugin/InputPlugin";
import ChatItem from "../ChatItem/ChatItem";
import { MESSAGE_ROLE, MESSAGE_STATUS } from "@/utils/constants";

const QAPanel = ({ messages, onInput, onAbort, intersectorRef, isRunning }) => {
  const [questionText, setQuestionText] = useState("");
  const hasMessages = messages.length > 0;
  const chatMessagesRef = useRef(null);

  const handleOnSubmit = useCallback(() => {
    onInput(questionText);
    setQuestionText("");
  }, [onInput, questionText]);

  const handleOnAbort = useCallback(() => {
    onAbort();
  }, [onAbort]);

  const textareaElement = (
    <LexicalComposer
      initialConfig={{
        namespace: "chat-input",
        editable: true,
        onError: (err) => logger.error(err),
        editorState: () => {},
        nodes: [TextNode],
      }}
    >
      <div className="qa-panel__editorContainer">
        <div className="qa-panel__inputWrapper">
          <PlainTextPlugin
            contentEditable={<ContentEditable className="qa-panel__input" />}
            placeholder={<div className="qa-panel__inputPlaceholder">Type something...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <InputPlugin
          onChange={(text) => setQuestionText(text)}
          input={questionText}
          onSubmit={handleOnSubmit}
        />
        <AutoFocusPlugin />
        <HistoryPlugin />
        <ClearEditorPlugin />
      </div>
    </LexicalComposer>
  );

  const _renderInitialMessage = useMemo(
    () => (
      <div className="qa-panel__chatHistory qa-panel__initialMessageDisplayed">
        <ChatItem
          message={{
            status: MESSAGE_STATUS.READY,
            content: <InitialMessage onQuestion={onInput} />,
            role: MESSAGE_ROLE.ASSISTANT,
            initial: true,
          }}
        />
      </div>
    ),
    [onInput]
  );

  const submitButton = useMemo(
    () => (
      <Button
        id="question-enter"
        className="qa-panel__submitBtn"
        onClick={isRunning ? handleOnAbort : handleOnSubmit}
        kind={isRunning ? "danger--ghost" : "ghost"}
        hasIconOnly
        renderIcon={isRunning ? StopOutline : Send}
        iconDescription={isRunning ? "Abort" : "Submit"}
        size="sm"
        disabled={!questionText && !isRunning}
      />
    ),
    [isRunning, handleOnAbort, handleOnSubmit, questionText]
  );

  useEffect(() => {
    if (!messages.length) {
      setQuestionText("");
    }
  }, [messages]);

  return (
    <div className="qa-panel__container">
      <div className="qa-panel__innerPanel">
        {!hasMessages ? (
          _renderInitialMessage
        ) : (
          <div id="chat-messages" ref={chatMessagesRef} className="qa-panel__chatHistory">
            <div id="auto-scroll" ref={intersectorRef} />
            {messages.map((message, index) => (
              <ChatItem
                key={`${message.role}:${message.timestamp}`}
                message={message}
                last={!index}
              />
            ))}
          </div>
        )}
        <div className="qa-panel__questionSection">
          <div className="qa-panel__questionInputContainer">
            {textareaElement}
            {submitButton}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAPanel;
