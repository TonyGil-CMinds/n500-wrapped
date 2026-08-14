import ExperienceRoot from './components/experience/ExperienceRoot'
import { resolveRecipient } from './lib/company'

export default async function HomePage({ searchParams }) {
  const { companyName, userName, initialPhase, initialSlide } = resolveRecipient(await searchParams)

  return (
    <ExperienceRoot
      companyName={companyName}
      userName={userName}
      initialPhase={initialPhase}
      initialSlide={initialSlide}
    />
  )
}
