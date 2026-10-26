import { business } from '../../data/site'
import { mailHref } from '../../lib/contact'
import { Icon } from '../Icon'
import { SocialLinks } from '../ui/SocialLinks'

export function TopBar() {
  return (
    <div className="hidden bg-navy-900 text-white md:block">
      <div className="container-page flex items-center justify-between gap-6 py-2 text-sm font-medium">
        <p className="flex items-center gap-2">
          <Icon name="pin" size={15} className="text-gold-300" />
          Serving {business.serviceArea}
        </p>
        <div className="flex items-center gap-5">
          <p className="hidden items-center gap-2 xl:flex">
            <Icon name="card" size={15} className="text-gold-300" />
            We accept {business.payments.join(' · ')}
          </p>
          {business.email && (
            <a href={mailHref} className="flex items-center gap-2 transition-colors hover:text-gold-300">
              <Icon name="mail" size={15} className="text-gold-300" />
              {business.email}
            </a>
          )}
          <SocialLinks size="sm" />
        </div>
      </div>
    </div>
  )
}
