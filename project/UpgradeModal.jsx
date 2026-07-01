// UpgradeModal.jsx — "Upgrade your plan" pricing modal.
// Triggered from the workspace dropdown's "Upgrade plan" item.
// Uses OrgShell's <Modal> (scrim + esc/close) and <Icon>.
// Content sourced from the Plans spec — Free / Pro / Business (no Enterprise,
// no internal notes).

const UPGRADE_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Use Grain for personal use; free forever.',
    price: '$0',
    unit: null,
    monthly: 'Free forever',
    btn: { label: 'Current plan', kind: 'disabled' },
    features: [
      'Personal account',
      'Unlimited meetings',
      '45-min meeting limit',
      '30-day history limit',
      'Desktop capture & bots',
      'MCP access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Use Grain personally with no limits.',
    price: '$14',
    unit: true,
    monthly: '$18 billed monthly',
    btn: { label: 'Upgrade', kind: 'neutral' },
    features: [
      'Personal account only',
      'No meeting length cap',
      'Unlimited history',
      'No upload cap',
      'MCP access',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: "Power your organization's AI with shared meeting intelligence.",
    price: '$34',
    unit: true,
    monthly: '$42 billed monthly',
    btn: { label: 'Upgrade', kind: 'primary' },
    badge: '14 days left in trial',
    highlight: true,
    features: [
      'Organization workspace',
      'No meeting length cap',
      'Unlimited history',
      'No upload cap',
      'API & Workspace integrations',
    ],
  },
];

function UpPlan({ plan, reactivate = false, showTrialBadge = true }) {
  const isBiz = plan.id === 'business';
  const badge = isBiz && reactivate ? 'Trial ended' : (showTrialBadge ? plan.badge : null);
  const btnLabel = isBiz && reactivate ? 'Reactivate' : plan.btn.label;
  return (
    <div className={`up-plan ${plan.highlight ? 'is-highlight' : ''}`}>
      {badge && <span className={`up-plan__badge ${isBiz && reactivate ? 'up-plan__badge--ended' : ''}`}>{badge}</span>}
      <div className="up-plan__name">{plan.name}</div>
      <div className="up-plan__tagline">{plan.tagline}</div>

      <div className="up-plan__price">
        <span className="up-plan__amt">{plan.price}</span>
        {plan.unit && <span className="up-plan__unit">per seat/month<br />billed annually</span>}
      </div>
      <div className="up-plan__monthly">{plan.monthly}</div>

      <button className={`up-plan__btn up-plan__btn--${plan.btn.kind}`}
              disabled={plan.btn.kind === 'disabled'}>
        {btnLabel}
      </button>

      <div className="up-feats">
        {plan.features.map((f) => (
          <div className="up-feat" key={f}><Icon name="check" size={15} stroke={2.5} /> <span>{f}</span></div>
        ))}
      </div>
    </div>
  );
}

function UpgradePlanModal({ open, onClose, reactivate = false, showTrialBadge = true, onTalkToSales }) {
  return (
    <Modal open={open} onClose={onClose} size="xl">
      <div className="up-modal">
        <div className="up-modal__head">
          <div className="up-modal__title"><Icon name="upgradeCircle" size={18} /> {reactivate ? 'Reactivate your organization' : 'Upgrade your plan'}</div>
          <button className="modal__close up-modal__close" onClick={onClose}><Icon name="close" /></button>
        </div>

        {reactivate && (
          <div className="up-reactivate">
            <div className="up-reactivate__text">
              <strong>Your Grain Business trial has ended.</strong> Your organization and its shared meetings are preserved — upgrade to switch them back on, or talk to sales about reactivating your trial.
            </div>
            <button className="up-reactivate__cta" onClick={onTalkToSales}>
              <Icon name="send" size={14} /> <span>Talk to sales to reactivate trial</span>
            </button>
          </div>
        )}

        <div className="up-grid">
          {UPGRADE_PLANS.map((p) => <UpPlan key={p.id} plan={p} reactivate={reactivate} showTrialBadge={showTrialBadge} />)}
        </div>

        <div className="up-foot">
          Need enterprise-level setup, access-control, and support?{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>Book a demo →</a>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { UpgradePlanModal });

/* ─── Checkout ────────────────────────────────────────────────────────────
   Reactivation has exactly one real plan choice (Grain Business), so the
   plan picker is skipped and the user lands straight on this checkout page.
   Presentational: card/bank tabs, Stripe-Link-style row, billing fields, and
   a live order summary. Pay is gated on accepting terms. */

const BUSINESS_ANNUAL = 348; // Grain Business, billed yearly

function renewDateString() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function CoField({ label, children, htmlFor }) {
  return (
    <div className="co-field">
      <label className="co-field__label" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function CheckoutModal({ open, onClose, onBack, billingEmail = '', onPaid }) {
  const [method, setMethod] = React.useState('card');
  const [agreed, setAgreed] = React.useState(false);
  const [promoOpen, setPromoOpen] = React.useState(false);
  const [promo, setPromo] = React.useState('');
  const [email, setEmail] = React.useState(billingEmail);

  React.useEffect(() => { if (open) { setAgreed(false); setMethod('card'); setPromoOpen(false); setPromo(''); setEmail(billingEmail); } }, [open, billingEmail]);

  const pay = () => { if (!agreed) return; onPaid?.(); };

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <div className="co">
        <div className="co__head">
          <button className="co__back" aria-label="Back" onClick={onBack || onClose}><Icon name="arrowLeft" size={18} /></button>
          <div className="co__title">Upgrade to Grain Business</div>
          <button className="co__close" aria-label="Close" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>

        <div className="co__body">
          {/* ── Payment form ── */}
          <div className="co__form">
            <div className="co-methods" role="tablist" aria-label="Payment method">
              <button
                role="tab"
                aria-selected={method === 'card'}
                className={`co-method ${method === 'card' ? 'is-active' : ''}`}
                onClick={() => setMethod('card')}>
                <Icon name="creditCard" size={20} />
                <span className="co-method__label">Card</span>
              </button>
              <button
                role="tab"
                aria-selected={method === 'bank'}
                className={`co-method ${method === 'bank' ? 'is-active' : ''}`}
                onClick={() => setMethod('bank')}>
                <Icon name="landmark" size={20} />
                <span className="co-method__label">Bank</span>
                <span className="co-method__perk">$20 back</span>
              </button>
            </div>

            <div className="co-link">
              <Icon name="lock" size={15} />
              <span>Secure, fast checkout with Link</span>
              <Icon name="chevDown" size={15} />
            </div>

            {method === 'card' ? (
              <>
                <CoField label="Card number" htmlFor="co-card">
                  <div className="co-input co-input--card">
                    <input id="co-card" type="text" inputMode="numeric" placeholder="1234 1234 1234 1234" />
                    <div className="co-brands" aria-hidden="true">
                      <span className="co-brand co-brand--visa">VISA</span>
                      <span className="co-brand co-brand--mc"><i /><i /></span>
                      <span className="co-brand co-brand--amex">AMEX</span>
                      <span className="co-brand co-brand--disc">DISC</span>
                    </div>
                  </div>
                </CoField>

                <div className="co-row">
                  <CoField label="Expiration date" htmlFor="co-exp">
                    <div className="co-input"><input id="co-exp" type="text" placeholder="MM / YY" /></div>
                  </CoField>
                  <CoField label="Security code" htmlFor="co-cvc">
                    <div className="co-input co-input--cvc">
                      <input id="co-cvc" type="text" inputMode="numeric" placeholder="CVC" />
                      <Icon name="creditCard" size={18} />
                    </div>
                  </CoField>
                </div>

                <div className="co-row">
                  <CoField label="Country" htmlFor="co-country">
                    <div className="co-input co-input--select">
                      <select id="co-country" defaultValue="US">
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                      <Icon name="chevDown" size={16} />
                    </div>
                  </CoField>
                  <CoField label="ZIP code" htmlFor="co-zip">
                    <div className="co-input"><input id="co-zip" type="text" inputMode="numeric" placeholder="12345" /></div>
                  </CoField>
                </div>

                <CoField label="Billing email" htmlFor="co-email">
                  <div className="co-input"><input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" /></div>
                </CoField>

                <p className="co-disclaimer">By providing your card information, you allow Grain to charge your card for future payments in accordance with their terms.</p>
              </>
            ) : (
              <>
                <CoField label="Billing email" htmlFor="co-email-bank">
                  <div className="co-input"><input id="co-email-bank" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" /></div>
                </CoField>
                <div className="co-bank">
                  <Icon name="landmark" size={18} />
                  <p>You’ll be redirected to securely connect your bank. Pay by bank and get <strong>$20 back</strong> on your first payment.</p>
                </div>
                <p className="co-disclaimer">By connecting your bank, you authorize Grain to debit your account for future payments in accordance with their terms.</p>
              </>
            )}
          </div>

          {/* ── Order summary ── */}
          <aside className="co__summary">
            <div className="co-sum__eyebrow">Order summary</div>
            <div className="co-sum__card">
              <div className="co-sum__plan">
                <span className="co-sum__planName">Grain Business</span>
                <span className="co-sum__cycle">YEARLY</span>
              </div>
              <div className="co-sum__line">
                <span>Annual plan</span>
                <span>${BUSINESS_ANNUAL.toFixed(2)}</span>
              </div>
              <div className="co-sum__line">
                <span>Billed today</span>
                <span>${BUSINESS_ANNUAL.toFixed(2)}</span>
              </div>
              <div className="co-sum__rule" />
              <div className="co-sum__line co-sum__line--total">
                <span>Total</span>
                <span>${BUSINESS_ANNUAL.toFixed(2)}</span>
              </div>
            </div>

            {promoOpen ? (
              <div className="co-promo">
                <input type="text" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" />
                <button type="button" className="co-promo__apply" disabled={!promo.trim()}>Apply</button>
              </div>
            ) : (
              <button type="button" className="co-sum__promo" onClick={() => setPromoOpen(true)}>+ Add promo code</button>
            )}

            <label className="co-terms">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I agree to the Grain <a href="#" onClick={(e) => e.preventDefault()}>Terms and Conditions</a></span>
            </label>

            <button className="co-pay" disabled={!agreed} onClick={pay}>
              <Icon name="lock" size={15} /> <span>Pay ${BUSINESS_ANNUAL}</span>
            </button>
            <p className="co-renew">Renews {renewDateString()}. Cancel anytime.</p>
          </aside>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { CheckoutModal });
