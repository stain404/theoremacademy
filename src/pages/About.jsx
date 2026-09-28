import { Approach, Experience, FinalCta, Outcomes, PageHeader, Story, usePageTitle } from '../components/sections'

export default function About() {
  usePageTitle('About')
  return (
    <>
      <PageHeader
        title="An academy for people who want to trade properly."
        intro="We teach forex, crypto and equity in classrooms in Dubai and India, and live online. Batches are small, one mentor stays with you from first class to final review, and every student leaves with a written plan."
      />
      <Approach />
      <Experience />
      <Story />
      <Outcomes />
      <FinalCta />
    </>
  )
}
