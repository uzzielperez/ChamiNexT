import { getCompanyLoops } from '../../data/loadCompanyLoops';
import CompanyLoopChallengeCard from './CompanyLoopChallengeCard';

export default function CompanyLoopsShowcase() {
  const loops = getCompanyLoops();

  return (
    <section className="py-20 md:py-28" id="company-loops">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-accent-blue uppercase tracking-widest mb-2">
              Practice real loops
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary max-w-xl">
              Company interview loops — salary bands, not prize pools
            </h2>
            <p className="text-text-secondary mt-3 max-w-2xl">
              Each card is a full hiring funnel: CV → foundations quiz → Work Ticket → ethics &
              behavioral. Progress syncs in your browser — placeholders until you unlock the real
              employer name.
            </p>
          </div>
          <p className="text-xs text-text-secondary max-w-xs hidden md:block">
            Six placeholder companies · four stages each · progress saved locally
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loops.map((loop) => (
            <CompanyLoopChallengeCard key={loop.id} loop={loop} />
          ))}
        </div>
      </div>
    </section>
  );
}
