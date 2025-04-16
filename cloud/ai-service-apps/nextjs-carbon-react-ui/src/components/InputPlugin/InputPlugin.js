import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { KEY_ENTER_COMMAND, CLEAR_EDITOR_COMMAND, COMMAND_PRIORITY_HIGH } from "lexical";

import hljs from "highlight.js/lib/core";
import hBash from "highlight.js/lib/languages/bash";
import hJava from "highlight.js/lib/languages/java";
import hJavascript from "highlight.js/lib/languages/javascript";
import hJson from "highlight.js/lib/languages/json";
import hMarkdown from "highlight.js/lib/languages/markdown";
import hPython from "highlight.js/lib/languages/python";
import hXml from "highlight.js/lib/languages/xml";

// Load any languages you need
hljs.registerLanguage("javascript", hJavascript);
hljs.registerLanguage("json", hJson);
hljs.registerLanguage("bash", hBash);
hljs.registerLanguage("python", hPython);
hljs.registerLanguage("markdown", hMarkdown);
hljs.registerLanguage("java", hJava);
hljs.registerLanguage("xml", hXml);

const InputPlugin = ({ input, onChange, onSubmit }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!input) {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND);
    }
  }, [input, editor]);

  useEffect(
    () =>
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (evt) => {
          if (evt.key === "Enter" && !evt.shiftKey) {
            evt.preventDefault();
            evt.stopPropagation();

            if (input !== "") {
              onSubmit();
            }

            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_HIGH
      ),
    [editor, input, onSubmit]
  );

  useEffect(
    () =>
      editor.registerTextContentListener((textContent) => {
        onChange(textContent);
      }),
    [editor, onChange]
  );

  return null;
};

export default InputPlugin;
