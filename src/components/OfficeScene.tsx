import { useEffect, useRef } from "react";
import { createOffice, type OfficeCallbacks, type OfficeHandles } from "../three/office";

export default function OfficeScene({
  events,
  handlesRef,
}: {
  events: OfficeCallbacks;
  handlesRef: React.MutableRefObject<OfficeHandles | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    if (!canvasRef.current) return;
    const handles = createOffice(canvasRef.current, {
      onReady: () => eventsRef.current.onReady(),
      onProgress: (p) => eventsRef.current.onProgress(p),
      onHover: (l) => eventsRef.current.onHover(l),
      onModeChange: (m) => eventsRef.current.onModeChange(m),
      onScreenRect: (r) => eventsRef.current.onScreenRect(r),
      onPhotoIndex: (i) => eventsRef.current.onPhotoIndex(i),
      onPosterIndex: (i) => eventsRef.current.onPosterIndex(i),
      onOpenPapers: (b) => eventsRef.current.onOpenPapers(b),
      onOpenNote: () => eventsRef.current.onOpenNote(),
      onOpenAbout: () => eventsRef.current.onOpenAbout(),
      onOpenAwards: () => eventsRef.current.onOpenAwards(),
      onOpenEducation: () => eventsRef.current.onOpenEducation(),
      onMusicToggle: (p) => eventsRef.current.onMusicToggle(p),
    });
    handlesRef.current = handles;
    return () => {
      handles.dispose();
      handlesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="office-canvas" />;
}
