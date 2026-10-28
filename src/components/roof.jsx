import { Suspense, lazy } from 'react'
import { useLiteObject } from '../hooks'

/* ===========================================================================
   THE ROOF

   The eave the curtains hang from, and the one place on the site where a real
   3D model earns its weight. three.js and the model live on their own chunk,
   loaded only when the roof is actually going to render.

   Model: "Japanese Temple Roof" by Tokuwa, CC Attribution (commercial use
   allowed with credit). It is not committed here: drop roof.glb into
   public/roof/ and flip HAS_MODEL.
   =========================================================================== */

export const HAS_MODEL = true

const Roof3D = lazy(() => import('./roof3d'))

function Beam() {
  // A plain eave so the curtains have something to hang from whenever the
  // model is absent, still loading, or declined for this device.
  return (
    <div className="jp-roof jp-roof--pending" aria-hidden="true">
      <div className="jp-beam" />
    </div>
  )
}

export default function Roof() {
  // `lite` here means a coarse pointer, a narrow viewport or a stated motion
  // preference. Those still get the roof, but rendered once and then left
  // alone rather than driven by a loop.
  const lite = useLiteObject()

  if (!HAS_MODEL) return <Beam />

  return (
    <Suspense fallback={<Beam />}>
      <Roof3D still={lite} />
    </Suspense>
  )
}
