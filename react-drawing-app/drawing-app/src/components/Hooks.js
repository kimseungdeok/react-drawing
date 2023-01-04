import { useEffect, useRef } from "react";
export function useOnDraw(onDraw) {
  const canvasRef = useRef(null);

  const isDrawingRef = useRef(false);

  const mouseMoveListernerRef = useRef(null);
  const mouseDownListernerRef = useRef(null);
  const mouseUpListernerRef = useRef(null);

  const prevPointRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mouseMoveListernerRef.current) {
        window.removeEventListener("mousemove", mouseMoveListernerRef.current);
      }
      if (mouseUpListernerRef.current) {
        window.current.removeEventListener(
          "mouseup",
          mouseUpListernerRef.current
        );
      }
    };
  }, []);

  function setCanvasRef(ref) {
    if (!ref) return;
    if (canvasRef.current) {
      canvasRef.current.removeEventListener(
        "mousedown",
        mouseDownListernerRef.current
      );
    }

    canvasRef.current = ref;
    initMouseMoveListener();
    initMouseDownListener();
    initMouseUpListener();
  }

  function initMouseMoveListener() {
    const mouseMoveListerner = (e) => {
      if (isDrawingRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY);
        const ctx = canvasRef.current.getContext("2d");
        if (onDraw) onDraw(ctx, point, prevPointRef.current);
        prevPointRef.current = point;
        console.log(point);
      }
    };
    mouseMoveListernerRef.current = mouseMoveListerner;
    window.addEventListener("mousemove", mouseMoveListerner);
  }

  function initMouseUpListener() {
    const listener = () => {
      isDrawingRef.current = false;
    };
    mouseUpListernerRef.current = listener;

    window.addEventListener("mouseup", listener);
  }

  function initMouseDownListener() {
    if (!canvasRef.current) return;
    const listener = () => {
      isDrawingRef.current = true;
    };
    mouseDownListernerRef.current = listener;

    canvasRef.current.addEventListener("mousedown", listener);
  }

  function computePointInCanvas(clientX, clientY) {
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
      };
    } else {
      return null;
    }
  }

  return setCanvasRef;
}
