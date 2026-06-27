import { useState } from 'react';

/**
 * Homegrown PNG captcha. Server returns config = { provider:'kaptcha', id, imageUrl, ttlSeconds }.
 * User types the answer; onSolved fires the payload the server expects.
 *
 * Props:
 *   config:    { provider, id, imageUrl, ... }
 *   baseUrl:   origin for the image src (prepended to imageUrl)
 *   onSolved:  ({ provider, id, answer }) => void
 *   onReload:  () => void — re-mint a fresh challenge from the parent
 */
export default function KaptchaAdapter({ config, baseUrl, onSolved, onReload }) {
  const [answer, setAnswer] = useState('');

  const handleChange = (e) => {
    const v = e.target.value;
    setAnswer(v);
    onSolved({ provider: 'kaptcha', id: config.id, answer: v });
  };

  return (
    <div className="form-group captcha-section">
      <label htmlFor="captchaAnswer">Enter the text shown *</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img
          src={`${baseUrl}${config.imageUrl}?t=${Date.now()}`}
          alt="CAPTCHA"
        />
        <button type="button" onClick={onReload} aria-label="Refresh captcha">🔄</button>
      </div>
      <input
        type="text"
        id="captchaAnswer"
        name="captchaAnswer"
        value={answer}
        onChange={handleChange}
        autoComplete="off"
        required
      />
    </div>
  );
}
