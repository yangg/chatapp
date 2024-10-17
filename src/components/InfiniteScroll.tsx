import {CircleAlert, Loader2} from "lucide-react";
import {useCallback, useEffect, useRef} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";

interface InfiniteScrollProps {
  initialized: boolean
  error: Error | undefined
  loading: boolean
  loadNext: () => void
  hasMore: boolean
}

export default function InfiniteScroll({initialized, error, loading, loadNext, hasMore}: InfiniteScrollProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading && !error && initialized) {
      loadNext()
    }
  }, [loadNext, hasMore, loading, error, initialized]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (messagesEndRef.current) observerRef.current.observe(messagesEndRef.current);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    }
  }, [handleObserver]);
  return (
      <>
        <div ref={messagesEndRef} style={{height: "1px"}}></div>
        <div className={`flex justify-center items-center pb-4 empty:hidden ${!initialized ? 'flex-1' : ''}`}>
          {loading ? <><Loader2 className="h-6 w-6 animate-spin"/><span
                  className={'text-xs ml-2'}>Loading...</span></>
              : error ? <><CircleAlert className="ml-1 size-4 text-destructive"/>
                    <span className={'text-xs ml-2 text-destructive'}>{error.message}</span>
                    <Button className={'ml-2'} size={'xs'} onClick={() => loadNext()}>Retry</Button></>
                  : (initialized && !hasMore) ? <>
                        <Separator className={'flex-1'}/>
                        <span className={'text-xs px-3'}>No more data</span>
                        <Separator className={'flex-1'}/></>
                      : <></>
          }
        </div>
      </>
  )
}
