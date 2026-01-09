type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary' | 'ghost'}
export default function Button({variant='primary', className='', ...rest}: Props){
  const base = 'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium'
  const styles = variant === 'primary' ? 'bg-primary text-white' : 'bg-transparent border border-slate-200 text-slate-800'
  return <button className={`${base} ${styles} ${className}`} {...rest} />
}
