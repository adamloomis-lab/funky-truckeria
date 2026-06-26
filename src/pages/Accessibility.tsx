import LegalLayout from '../components/LegalLayout'
import { company } from '../data/site'

export default function Accessibility() {
  return (
    <LegalLayout title="Accessibility Statement" updated="June 2026">
      <h2>Our commitment</h2>
      <p>
        This site is built to WCAG 2.1 AA, the standard referenced by the ADA for web accessibility.
        We review and update our accessibility practices on an ongoing basis.
      </p>

      <h2>What we have done</h2>
      <p>
        We have taken the following steps to make this site accessible to everyone:
      </p>
      <ul>
        <li>
          Keyboard navigation: skip links are provided so keyboard and screen reader users can bypass
          navigation and get straight to the main content.
        </li>
        <li>
          Focus indicators: a visible outline appears on every interactive element when navigated by
          keyboard.
        </li>
        <li>
          Color contrast: text colors meet the 4.5:1 minimum contrast ratio for readability by people
          with low vision.
        </li>
        <li>
          Screen reader labels: all form fields, buttons, and interactive elements have descriptive
          labels.
        </li>
        <li>
          Motion sensitivity: animations automatically reduce for users who have the Reduce Motion
          preference enabled on their device.
        </li>
      </ul>

      <h2>Report an issue</h2>
      <p>
        If you encounter any accessibility barrier on this site, please contact us and we will address
        it promptly. Call us at <a href={company.phoneHref}>{company.phone}</a> or visit our{' '}
        <a href="/contact">contact page</a>.
      </p>
    </LegalLayout>
  )
}
