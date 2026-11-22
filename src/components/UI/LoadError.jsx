export default function LoadError({retry}) {
  return <div className="api-error" role="alert"><p>We couldn’t load this content. Please try again.</p><button className="btn-main" onClick={retry}>Try again</button></div>;
}
