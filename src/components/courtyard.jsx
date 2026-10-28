const LEAF = 'M32 2 38 20 49 12 46 29 62 25 51 40 55 48 36 46 33 61 29 46 10 49 15 39 2 26 20 29 16 13 27 21Z'

export default function Courtyard() {
  return <div className="jp-atmosphere" aria-hidden="true">
    <div className="jp-tree-shadow" />
    <div className="jp-ground" />
    <div className="jp-lantern"><i /></div>
    <svg className="jp-maple-branch" viewBox="0 0 340 400">
      <path d="M-20 390 Q95 210 28 -30 M55 230 210 80 M61 140 160 20" fill="none" stroke="#493329" strokeWidth="7" />
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={LEAF} fill={i % 3 ? '#9d3023' : '#c54e32'} transform={`translate(${(i * 67) % 235 - 25} ${(i * 103) % 350 - 30}) rotate(${i * 37} 32 32) scale(${0.55 + i % 4 * 0.15})`} />)}
    </svg>
    {Array.from({ length: 18 }, (_, i) => <svg key={i} className="jp-falling-leaf" viewBox="0 0 64 64" style={{ '--x': `${(i * 37) % 100}%`, '--delay': `${-i * 1.7}s`, '--duration': `${13 + i % 5 * 2}s`, '--size': `${15 + i % 4 * 8}px` }}><path d={LEAF} /><path d="m32 13 0 42m0-20 12-8m-12 14-13-9" fill="none" stroke="#70281c" strokeWidth="1" /></svg>)}
  </div>
}
