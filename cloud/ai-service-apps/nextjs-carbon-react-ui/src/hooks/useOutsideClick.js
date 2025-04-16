import { useRef, useEffect } from "react";

const useOutsideClick = (callback, exceptionDomIds) => {
  const ref = useRef();

  const isOutsideOfException = (target) => {
    if (exceptionDomIds && exceptionDomIds.length > 0) {
      return !exceptionDomIds.some((id) => {
        const element = document.getElementById(id);
        return element && element.contains(target);
      });
    }

    return true;
  };

  const isOutsideOfElement = (target) => ref.current && !ref.current.contains(target);

  const handleClick = ({ target }) => {
    if (isOutsideOfElement(target) && isOutsideOfException(target)) {
      callback();
    }
  };

  useEffect(() => {
    if (window !== undefined) {
      document.addEventListener("click", handleClick);
    }
    return () => {
      if (window !== undefined) {
        document.removeEventListener("click", handleClick);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
};

export { useOutsideClick };
