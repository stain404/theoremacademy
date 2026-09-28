import { FinalCta, PageHeader, Stories, usePageTitle } from '../components/sections'
import { FacultyProfile } from '../components/ui'
import { teachers } from '../config/site'

export default function Mentors() {
  usePageTitle('Mentors')
  return (
    <>
      <PageHeader
        title="The people teaching you."
        intro="Each program is led by one mentor. You meet them in your first class, and they review your trades until your last."
      />
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="wrap space-y-20 lg:space-y-32">
          {teachers.map((t, i) => <FacultyProfile key={t.name} person={t} reverse={i % 2 === 1} />)}
        </div>
      </section>
      <Stories />
      <FinalCta />
    </>
  )
}
