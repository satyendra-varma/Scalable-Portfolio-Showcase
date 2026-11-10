import { Link } from 'wouter';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import '@/styles/room.css';

export default function NotFound() {
  useDocumentMeta('Page not found | Satyendra Varma Nadimpalli', 'This page does not exist on the portfolio.');
  return (
    <div className="rp" data-testid="page-not-found">
      <main className="rp-404" aria-labelledby="nf-title">
        <p className="rp-404-code" aria-hidden="true">404 // NOT ON THE BLUEPRINT</p>
        <h1 id="nf-title" className="rp-name">This page isn’t on the record.</h1>
        <p className="rp-pos">The link may be mistyped or out of date.</p>
        <Link href="/" className="rp-toggle rp-404-home" data-testid="link-404-home">Back to the room</Link>
      </main>
    </div>
  );
}
