import logo from '../assets/img/logo.webp'

export function Logo({ className = '' }: { className?: string }) {
  return <img src={logo} alt="Oasis Pools" width={440} height={351} className={`w-auto ${className}`} />
}
