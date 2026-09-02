// Public page copy and routes. Calculator implementations stay in the existing bundles.
export const SITE_URL = 'https://mine-survey-tools.vercel.app';
export const TOOLS = [
  {
    key: 'bearing', slug: 'bearing-distance-calculator', title: 'Bearing and Distance Calculator', category: 'Coordinates & COGO',
    description: 'Convert a survey bearing and horizontal distance into delta Easting and delta Northing. Free whole-circle bearing calculator with formulas and an example.',
    intro: 'Resolve a horizontal survey line into its Easting and Northing components. Bearings run clockwise from grid north: north is 0°, east is 90°, south is 180° and west is 270°.',
    steps: ['Enter the whole-circle bearing in decimal degrees.', 'Enter horizontal distance in metres, not slope distance.', 'Read ΔE and ΔN, including their signs, before adding them to a starting coordinate.'],
    formula: 'ΔE = D × sin(θ)\nΔN = D × cos(θ)',
    example: 'A bearing of 30° and horizontal distance of 100 m give ΔE = +50.000 m and ΔN = +86.603 m. The line travels north-east.',
    caution: 'Use one bearing reference throughout. Magnetic, true and grid north are not interchangeable. Convert degrees to radians when using a programming-language trig function.',
    related: ['delta', 'coord', 'slopereduce']
  },
  {
    key: 'delta', slug: 'bearing-from-coordinates', title: 'Bearing from Coordinate Differences', category: 'Coordinates & COGO',
    description: 'Calculate survey bearing and horizontal distance from delta Easting and delta Northing, with correct quadrants and a degrees-minutes-seconds result.',
    intro: 'Calculate the direction and horizontal distance from one survey point to another. First subtract the start coordinate from the end coordinate to obtain signed ΔE and ΔN.',
    steps: ['Calculate ΔE = end Easting − start Easting.', 'Calculate ΔN = end Northing − start Northing.', 'Enter both differences in metres and read the whole-circle bearing and distance.'],
    formula: 'D = √(ΔE² + ΔN²)\nθ = atan2(ΔE, ΔN), converted to degrees and normalised to 0–360°',
    example: 'For ΔE = +30 m and ΔN = +40 m, the distance is 50.000 m and the bearing is 36° 52′ 11.63″. Reversing the points reverses both coordinate differences.',
    caution: 'Do not use atan(ΔE / ΔN) alone without quadrant corrections. Coincident points have zero distance and no defined bearing.',
    related: ['bearing', 'coord', 'traverse']
  },
  {
    key: 'coord', slug: 'coordinate-calculator', title: 'Survey Coordinate Calculator', category: 'Coordinates & COGO',
    description: 'Find a new Easting and Northing from a starting coordinate, bearing and horizontal distance. Free survey coordinate calculator with a worked example.',
    intro: 'Project a new point from a known Easting and Northing using a whole-circle bearing and horizontal distance. This is a planar COGO calculation, not a change of coordinate datum.',
    steps: ['Enter the start Easting and Northing in metres.', 'Enter a clockwise-from-north bearing in decimal degrees and a horizontal distance.', 'Read the new coordinate and check the signed Easting and Northing differences.'],
    formula: 'E₂ = E₁ + D × sin(θ)\nN₂ = N₁ + D × cos(θ)',
    example: 'From E 400000.000, N 6800000.000, a bearing of 90° over 100 m gives E 400100.000, N 6800000.000.',
    caution: 'Start coordinates, bearing and distance must refer to the same working grid. This tool does not apply ground-to-grid scale factors or geodesic corrections.',
    related: ['bearing', 'delta', 'coordconv']
  },
  {
    key: 'coordconv', slug: 'australian-coordinate-converter', title: 'Australian Coordinate Converter', category: 'Coordinates & COGO',
    description: 'Convert Australian horizontal coordinates between MGA2020, MGA94, AMG84, AMG66, WGS84 and supported local grids such as PCG2020. Select system and zone.',
    intro: 'Convert horizontal coordinates between supported Australian coordinate systems. Choose the datum and projection family first, then the correct zone or local grid, including MGA, AMG and WA project grids.',
    steps: ['Select the source coordinate system and zone or local grid.', 'Select the destination system and zone, then enter the coordinate using the displayed input labels.', 'Where a datum shift is required, read the transformation status and check the result against trusted control.'],
    formula: 'Source grid → source geographic coordinates → applicable datum transformation → destination grid',
    example: 'GDA2020 latitude −28° and longitude 123° convert to MGA2020 Zone 51 E 500000.000 m, N 6902797.629 m. This example changes projection only, not datum. Follow the latitude/longitude labels in the form.',
    caution: 'Horizontal conversion does not convert AHD RLs or ellipsoidal heights. Legacy-grid coverage, required datum grids and transformation accuracy must be checked for your location and purpose. Do not treat WGS84 and GDA2020 as identical for precise control work.',
    related: ['minegrid', 'coord', 'controlcheck']
  },
  {
    key: 'minegrid', slug: 'mine-grid-transformation', title: 'Local Mine Grid Transformation Calculator', category: 'Coordinates & COGO',
    description: 'Solve a 2D similarity transformation between survey and local mine grids using common control points. Inspect translation, rotation, scale and residuals.',
    intro: 'Fit a least-squares 2D similarity transformation from points known in both coordinate systems. The model estimates two translations, one rotation and one uniform scale factor.',
    steps: ['Enter matching source and local Eastings and Northings for each common control point.', 'Use at least two distinct points; use three or more well-distributed points to provide redundancy.', 'Inspect residuals before using the forward or inverse coordinate transformation.'],
    formula: 'Local E = Tx + aE − bN\nLocal N = Ty + bE + aN\nScale = √(a² + b²)',
    example: 'Use source points (1000, 2000), (1100, 2000), (1000, 2100) and local points (1500, 3000), (1600, 3000), (1500, 3100). The fit gives Tx = +500 m, Ty = +1000 m, scale = 1 and rotation = 0°.',
    caution: 'Two points provide no redundancy. This model does not solve vertical datums, non-uniform scale, shear or local distortion. Check independent control before applying a site transformation.',
    related: ['coordconv', 'controlcheck', 'coord']
  },
  {
    key: 'chainage', slug: 'chainage-offset-calculator', title: 'Chainage and Offset Calculator', category: 'Coordinates & COGO',
    description: 'Calculate chainage, signed perpendicular offset and the closest coordinate from a survey point to a straight line defined by two Easting/Northing points.',
    intro: 'Locate a surveyed point relative to a straight design line from A to B. Chainage starts at A, and a positive offset is left of the line when looking from A toward B.',
    steps: ['Enter distinct line endpoints A and B in the same coordinate system.', 'Enter the Easting and Northing of the point being checked.', 'Read chainage from A, left/right offset and the perpendicular foot on the line.'],
    formula: 'u = (B − A) / |B − A|\nChainage = (P − A) · u\nOffset = uE × (NP − NA) − uN × (EP − EA)',
    example: 'For A (1000, 2000), B (1000, 2100) and P (1010, 2040), chainage is 40.000 m and offset is −10.000 m: 10 m to the right. The perpendicular foot is (1000, 2040).',
    caution: 'The calculation uses the extended straight line, not a clamped line segment or curved alignment. Chainage may be negative or greater than the length A–B.',
    related: ['delta', 'coord', 'polygon']
  },
  {
    key: 'traverse', slug: 'traverse-closure-calculator', title: 'Traverse Closure Calculator', category: 'Traverse & Control',
    description: 'Calculate linear traverse misclose and relative precision from Easting/Northing closure errors and total traverse length. Includes a worked survey example.',
    intro: 'Check the size of a traverse closure error before adjustment. Enter coordinate misclosure components relative to the known closing point, rather than the raw coordinate totals of an open traverse.',
    steps: ['Calculate Easting and Northing misclosures as calculated end minus known end.', 'Enter both signed misclosure components in metres.', 'Enter the sum of all horizontal leg distances and read the linear misclose and precision ratio.'],
    formula: 'Linear misclose = √(fE² + fN²)\nRelative precision = 1 : (total traverse length / linear misclose)',
    example: 'For Easting misclose +0.012 m, Northing misclose −0.009 m and total length 1500 m, linear misclose is 0.015 m and relative precision is 1 : 100000.',
    caution: 'An acceptable ratio depends on the survey purpose and applicable procedure. A good closure alone does not rule out compensating errors or prove every station is correct.',
    related: ['bowditch', 'delta', 'controlcheck']
  },
  {
    key: 'bowditch', slug: 'bowditch-traverse-calculator', title: 'Bowditch Traverse Adjustment Calculator', category: 'Traverse & Control',
    description: 'Adjust a closed or connected survey traverse using the Bowditch rule. Enter bearings and distances to calculate closure, corrections and adjusted coordinates.',
    intro: 'Distribute Easting and Northing misclosure in proportion to each traverse leg length. The calculator reports unadjusted components, leg corrections, adjusted coordinates and relative precision.',
    steps: ['Enter the known start and closing coordinates; for a closed loop, these are the same point.', 'Enter each leg bearing and horizontal distance in sequence. Bearings accept decimal degrees or DMS such as 123 45 30.', 'Check the closure first, then inspect the corrections and adjusted endpoint.'],
    formula: 'fE = calculated end E − known end E\ncEᵢ = −fE × Lᵢ / ΣL\ncNᵢ = −fN × Lᵢ / ΣL',
    example: 'For total length 1000 m with fE = +0.020 m and fN = −0.010 m, a 200 m leg receives an Easting correction of −0.004 m and a Northing correction of +0.002 m.',
    caution: 'Identify blunders and resolve any angular adjustment before applying the coordinate adjustment. Bowditch is not a substitute for a least-squares network adjustment or your survey acceptance checks.',
    related: ['traverse', 'bearing', 'controlcheck']
  },
  {
    key: 'controlcheck', slug: 'survey-control-comparison', title: 'Survey Control Comparison Calculator', category: 'Traverse & Control',
    description: 'Compare known and observed survey control coordinates. Calculate delta Easting, Northing, RL, horizontal and 3D differences in millimetres.',
    intro: 'Make a one-off coordinate comparison for survey control points. Signed differences are observed minus known, with horizontal and three-dimensional magnitudes reported alongside the component differences.',
    steps: ['Match each point ID to its known Easting, Northing and RL.', 'Enter the observed coordinate in the same horizontal and vertical reference systems.', 'Review each difference and the summary against the tolerance for the job.'],
    formula: 'ΔE = observed E − known E\nΔN = observed N − known N\nΔRL = observed RL − known RL\nHorizontal = √(ΔE² + ΔN²); 3D = √(ΔE² + ΔN² + ΔRL²)',
    example: 'Known coordinate (400000.000, 6800000.000, 100.000) and observed (400000.003, 6800000.004, 100.012) give +3, +4 and +12 mm components, 5 mm horizontal and 13 mm 3D difference.',
    caution: 'This is a coordinate check, not a stored control register or an automatic acceptance decision. Confirm the point identity, setup, datum and units before interpreting a discrepancy.',
    related: ['prism', 'minegrid', 'traverse']
  },
  {
    key: 'level', slug: 'levelling-misclose-calculator', title: 'Levelling Misclose Calculator', category: 'Levelling',
    description: 'Calculate levelling misclose from known start and end RLs and summed backsights and foresights. Shows closure error in metres and millimetres.',
    intro: 'Check a connected level run using its known benchmark RLs and the sums of backsights and foresights. The sign convention here is calculated end RL minus known end RL.',
    steps: ['Enter the known start and end reduced levels in metres.', 'Enter the total backsights and total foresights. Do not add intermediate sights to either sum.', 'Read the calculated end RL and signed misclose in metres and millimetres.'],
    formula: 'Calculated end RL = start RL + ΣBS − ΣFS\nMisclose = calculated end RL − known end RL',
    example: 'Start RL 100.000 m, ΣBS 12.486 m and ΣFS 12.650 m give calculated end RL 99.836 m. With known end RL 99.842 m, the misclose is −0.006 m, or −6.0 mm.',
    caution: 'The correction required at the end has the opposite sign to the misclose. Compare the error with the tolerance specified for the level run; this tool does not assign one.',
    related: ['levelrun', 'gradient', 'controlcheck']
  },
  {
    key: 'levelrun', slug: 'level-traverse-calculator', title: 'Level Traverse and RL Calculator', category: 'Levelling',
    description: 'Reduce a survey level book with BS, IS and FS observations using height of collimation. Calculate RLs, misclose and equal-by-setup adjustments.',
    intro: 'Enter a field-book-style level run to calculate height of instrument, reduced levels and closure. At a change point, enter the foresight and the next setup’s backsight on the same row.',
    steps: ['Enter the known starting RL and, if available, the known closing RL.', 'Enter points in order with backsight, intermediate sight and foresight readings; leave unused cells blank.', 'Review the raw RLs and misclose before using the equal-by-setup adjusted RL column.'],
    formula: 'HI = known or calculated point RL + BS\nPoint RL = HI − IS (or HI − FS)\nCumulative correction = −misclose × completed setups / total setups',
    example: 'Start at RL 100.000 m with BS 1.500 m: HI = 101.500 m. An IS of 2.000 m gives RL 99.500 m. A closing FS of 1.250 m gives RL 100.250 m; against known RL 100.248 m, misclose is +2 mm.',
    caution: 'Adjustment is equal by completed setup, not distance-weighted. Intermediate points share their completed-setup correction. Use the method required by your survey procedure.',
    related: ['level', 'slopereduce', 'controlcheck']
  },
  {
    key: 'prism', slug: 'prism-monitoring', title: 'Prism Monitoring and Movement Calculator', category: 'Monitoring & Data',
    description: 'Compare prism monitoring rounds from Trimble JXL or CSV files. View horizontal, vertical and 3D movement over time for one prism or all common prisms.',
    intro: 'Compare repeated coordinates for the same monitoring prisms and graph movement by observation date. View component, horizontal or 3D movement relative to a baseline or the previous observation.',
    steps: ['Clear the synthetic example rounds before loading your own JXL files or a CSV with point ID, date, Easting, Northing and RL columns.', 'Check point names, dates and coordinate reference systems, then choose one prism or all common prisms.', 'Select the movement metric, baseline or previous-observation reference, and date range. Export the session if required.'],
    formula: 'ΔE = new E − reference E; ΔN = new N − reference N\nΔRL = new RL − reference RL\nHorizontal = √(ΔE² + ΔN²); 3D = √(ΔE² + ΔN² + ΔRL²)',
    example: 'A prism changing from (400000.000, 6800000.000, 100.000) to (400000.003, 6800000.004, 100.012) moves +3 mm E, +4 mm N and +12 mm vertically: 5 mm horizontally and 13 mm in 3D.',
    caution: 'Imported monitoring data is session-only. Coordinate differences do not by themselves distinguish physical movement from measurement or control error. This viewer is not an alarm system or a geotechnical stability assessment.',
    related: ['jxlcsv', 'controlcheck', 'delta']
  },
  {
    key: 'jxlcsv', slug: 'trimble-jxl-to-csv', title: 'Trimble JXL to CSV Converter', category: 'Monitoring & Data',
    description: 'Extract observed survey points from Trimble JobXML JXL files into CSV. Match DirectReading records to reduced Easting, Northing and RL coordinates.',
    intro: 'Extract reduced grid coordinates for points with valid DirectReading observations in a Trimble JobXML file. The tool matches observed point names to the file’s Reductions section.',
    steps: ['Choose one or more Trimble JXL files containing observations and reduced grid coordinates.', 'Review the matched point IDs, E/N/RL coordinates, raw-shot counts and available face information.', 'Download the CSV and check several rows against the source job before using it elsewhere.'],
    formula: 'Non-deleted DirectReading point names ∩ reduced-grid point names → exported coordinate rows',
    example: 'If P01 has two non-deleted DirectReading records and a matching reduced coordinate E 400000.000, N 6800000.000, RL 100.000, the export includes one reduced P01 row with two raw shots.',
    caution: 'This is not a universal export of every JXL record. Points without matching DirectReading and reduced-grid records are excluded. It does not recompute coordinates from raw angles and distances or convert datums.',
    related: ['prism', 'controlcheck', 'coordconv']
  },
  {
    key: 'drilltoe', slug: 'drillhole-toe-calculator', title: 'Drillhole and Blast-Hole Toe Calculator', category: 'Mine Design',
    description: 'Calculate a straight drillhole toe coordinate from collar Easting, Northing, RL, azimuth, dip and hole length. Shows horizontal displacement and vertical drop.',
    intro: 'Project a straight drillhole or blast hole from its collar coordinate. Dip is positive below horizontal: 0° is horizontal and 90° is vertical down.',
    steps: ['Enter collar Easting, Northing and RL in metres.', 'Enter clockwise-from-north azimuth, dip below horizontal and total hole length.', 'Read the projected toe coordinate, horizontal displacement and vertical drop.'],
    formula: 'Horizontal displacement = L × cos(dip)\nDrop = L × sin(dip)\nToe E = collar E + horizontal × sin(azimuth)\nToe N = collar N + horizontal × cos(azimuth)\nToe RL = collar RL − drop',
    example: 'From collar (400000, 6800000, 100), a 20 m hole at azimuth 90° and dip 60° has horizontal displacement 10.000 m and drop 17.321 m. Its toe is E 400010.000, N 6800000.000, RL 82.679 m.',
    caution: 'The model assumes a straight hole with constant direction. It does not use downhole deviation surveys or calculate a curved hole path. Check whether your source data uses negative dips or a different angular convention.',
    related: ['bearing', 'slopereduce', 'batter']
  },
  {
    key: 'batter', slug: 'batter-rehabilitation-calculator', title: 'Batter and Rehabilitation Setback Calculator', category: 'Mine Design',
    description: 'Compare tipped and final rehabilitation batters. Calculate horizontal widths, crest setback, toe extension and equal-area section geometry from lift height.',
    intro: 'Compare a tipped or repose slope with a flatter final rehabilitation slope in section. The equal-area model splits the difference in horizontal widths equally between crest setback and toe extension.',
    steps: ['Enter lift height, final rehabilitation angle and tipped/repose angle.', 'Read the tipped and rehab widths and the crest/toe offsets.', 'Choose section orientation and toggle measurements to inspect the geometry.'],
    formula: 'Rehab width = H / tan(rehab angle)\nTipped width = H / tan(repose angle)\nCrest setback = toe extension = (rehab width − tipped width) / 2',
    example: 'For height 10 m, rehab angle 30° and repose angle 45°, rehab width is 17.321 m and tipped width is 10.000 m. Crest setback and toe extension are each 3.660 m.',
    caution: 'Angles are measured from horizontal. The section assumes equal area and ignores swell, compaction, irregular terrain and material loss. A negative setback means the selected angle relationship is reversed. This is geometry, not a slope-stability assessment.',
    related: ['gradient', 'slopereduce', 'polygon']
  },
  {
    key: 'gradient', slug: 'gradient-calculator', title: 'Gradient, Slope and Grade Calculator', category: 'Area & Geometry',
    description: 'Convert rise and horizontal run into percentage grade, slope angle, 1 in X gradient and millimetres per metre. Includes a 1:8 worked example.',
    intro: 'Express the same slope as a percentage, angle, rise-to-run ratio or millimetres per metre. Use horizontal run, not the measured distance along the slope.',
    steps: ['Enter rise or fall in metres; use a negative value for a fall.', 'Enter a positive horizontal run in metres.', 'Read the equivalent percentage grade, angle, 1:X ratio and mm/m.'],
    formula: 'Grade (%) = rise / run × 100\nAngle = atan(rise / run)\nmm/m = rise / run × 1000\n1:X uses X = |run / rise|',
    example: 'A 1 m rise over an 8 m horizontal run is 12.5%, 7.1250°, 1:8 and 125 mm/m. A 1 m fall over the same run gives negative grade, angle and mm/m.',
    caution: 'The displayed 1:X ratio is a magnitude; use the signed grade or rise/fall to determine direction. A level line has zero rise. A zero horizontal run is outside normal gradient calculations.',
    related: ['slopereduce', 'batter', 'level']
  },
  {
    key: 'slopereduce', slug: 'slope-distance-calculator', title: 'Slope Distance to Horizontal Distance Calculator', category: 'Area & Geometry',
    description: 'Reduce slope distance to horizontal distance and vertical difference using either a zenith angle or an angle from horizontal. Includes optional end RL.',
    intro: 'Resolve a measured slope distance into horizontal and vertical components. Select the correct angle convention before entering the observation.',
    steps: ['Enter slope distance in metres.', 'Choose zenith angle (0° up, 90° horizontal) or angle from horizontal (positive up, negative down).', 'Enter the angle in decimal degrees and optionally a start RL to obtain the end RL.'],
    formula: 'From horizontal: HD = S × cos(α); ΔH = S × sin(α)\nFrom zenith: HD = S × sin(Z); ΔH = S × cos(Z)\nEnd RL = start RL + ΔH',
    example: 'A 100 m slope distance at +30° from horizontal gives HD = 86.603 m and ΔH = +50.000 m. A zenith angle of 60° gives the same result. Starting at RL 100 m gives end RL 150 m.',
    caution: 'The calculator does not apply instrument height, target height, curvature, refraction or ground-to-grid corrections. Apply required corrections separately for point RLs or precision survey reductions.',
    related: ['gradient', 'bearing', 'drilltoe']
  },
  {
    key: 'polygon', slug: 'polygon-area-calculator', title: 'Polygon Area and Perimeter Calculator', category: 'Area & Geometry',
    description: 'Calculate polygon area, hectares, perimeter and centroid from survey Easting/Northing coordinates. Enter boundary points and view the polygon in plan.',
    intro: 'Calculate the horizontal plan area of a simple polygon from its boundary coordinates. Enter points consecutively around the perimeter, clockwise or anticlockwise; the last point closes to the first automatically.',
    steps: ['Enter at least three boundary vertices as Easting/Northing pairs in metres.', 'Keep the boundary order and inspect the plan preview for crossings or misplaced points.', 'Read area in square metres and hectares, perimeter and centroid coordinate.'],
    formula: 'Area = ½ × |Σ(EᵢNᵢ₊₁ − Eᵢ₊₁Nᵢ)|\nPerimeter = Σ√((Eᵢ₊₁ − Eᵢ)² + (Nᵢ₊₁ − Nᵢ)²)\nHectares = square metres / 10000',
    example: 'The ordered corners (400000, 6800000), (400100, 6800000), (400100, 6800100), (400000, 6800100) form a 100 m square: area 10000 m², or 1 ha; perimeter 400 m; centroid (400050, 6800050).',
    caution: 'This is planar area, not the surface area of sloping ground. Self-intersections, holes and geographic latitude/longitude coordinates are not handled as a general GIS polygon operation.',
    related: ['chainage', 'coord', 'batter']
  }
];

export const toolPath = tool => `/tools/${tool.slug}`;
export const byKey = key => TOOLS.find(tool => tool.key === key);
export const bySlug = slug => TOOLS.find(tool => tool.slug === slug);
