export default function CodeBlock({ code, language = 'xml' }) {
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
