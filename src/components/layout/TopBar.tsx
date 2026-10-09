import { business } from '../../data/site'
import { Icon } from '../Icon'

export function TopBar() {
  return (
    <div className="hidden bg-navy-900 text-white md:block">
      <div className="container-page flex items-center justify-between py-2.5 text-sm font-medium">
        <p className="flex items-center gap-2">
          <Icon name="pin" size={15} className="text-gold-300" />
          Serving {business.serviceArea}
        </p>
        <p className="flex items-center gap-2">
          <Icon name="card" size={15} className="text-gold-300" />
          We accept {business.payments.join(' · ')}
        </p>
      </div>
    </div>
  )
}
