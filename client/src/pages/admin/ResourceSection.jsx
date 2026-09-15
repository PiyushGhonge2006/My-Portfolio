import ResourceManager from '../../components/admin/ResourceManager'
import { resourceConfigs } from './resourceConfigs'

export default function ResourceSection({ section }) {
  const config = resourceConfigs[section]
  if (!config) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400">Section not found.</p>
      </div>
    )
  }
  return <ResourceManager config={config} />
}