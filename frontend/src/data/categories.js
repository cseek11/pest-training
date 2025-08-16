export const CERTIFICATION_CATEGORIES = [
  {
    id: '01',
    name: 'Agronomic Crops',
    description: 'Pest control for field crops, grains, and agricultural commodities',
    slug: 'agronomic-crops'
  },
  {
    id: '02',
    name: 'Fruit and Nuts',
    description: 'Pest management for fruit trees, nut trees, and orchards',
    slug: 'fruit-and-nuts'
  },
  {
    id: '03',
    name: 'Vegetable Crops',
    description: 'Pest control for vegetable gardens and commercial vegetable production',
    slug: 'vegetable-crops'
  },
  {
    id: '04',
    name: 'Agricultural Animals',
    description: 'Pest control related to livestock and agricultural animal facilities',
    slug: 'agricultural-animals'
  },
  {
    id: '05',
    name: 'Forest Pest Control',
    description: 'Pest management for forested areas and timber production',
    slug: 'forest-pest-control'
  },
  {
    id: '06',
    name: 'Ornamental and Shade Trees',
    description: 'Pest control for ornamental plants and shade trees',
    slug: 'ornamental-and-shade-trees'
  },
  {
    id: '07',
    name: 'Lawn and Turf',
    description: 'Pest management for lawns, golf courses, and turf areas',
    slug: 'lawn-and-turf'
  },
  {
    id: '08',
    name: 'Seed Treatment',
    description: 'Pest control through seed treatment and protection',
    slug: 'seed-treatment'
  },
  {
    id: '09',
    name: 'Aquatic Pest Control',
    description: 'Pest management for aquatic environments and water systems',
    slug: 'aquatic-pest-control'
  },
  {
    id: '10',
    name: 'Right-of-way and Weeds',
    description: 'Pest control for rights-of-way, roadsides, and weed management',
    slug: 'right-of-way-and-weeds'
  },
  {
    id: '11',
    name: 'Household and Health Related',
    description: 'Pest control for residential and health-related environments',
    slug: 'household-and-health-related'
  },
  {
    id: '12',
    name: 'Wood Destroying Pests',
    description: 'Pest control for termites, carpenter ants, and wood-destroying insects',
    slug: 'wood-destroying-pests'
  },
  {
    id: '13',
    name: 'Structural Fumigation',
    description: 'Fumigation techniques for structural pest control',
    slug: 'structural-fumigation'
  },
  {
    id: '15',
    name: 'Public Health - Vertebrate Pests',
    description: 'Control of vertebrate pests affecting public health',
    slug: 'public-health-vertebrate-pests'
  },
  {
    id: '16',
    name: 'Public Health - Invertebrate Pests',
    description: 'Control of invertebrate pests affecting public health',
    slug: 'public-health-invertebrate-pests'
  },
  {
    id: '17',
    name: 'Regulatory Pest Control',
    description: 'Pest control for regulatory compliance and quarantine',
    slug: 'regulatory-pest-control'
  },
  {
    id: '18',
    name: 'Demonstration and Research',
    description: 'Pest control for research, demonstration, and educational purposes',
    slug: 'demonstration-and-research'
  },
  {
    id: '19',
    name: 'Wood Preservation',
    description: 'Preservation and protection of wood products and structures',
    slug: 'wood-preservation'
  },
  {
    id: '20',
    name: 'Commodity and Space Fumigation',
    description: 'Fumigation for commodities and enclosed spaces',
    slug: 'commodity-and-space-fumigation'
  },
  {
    id: '21',
    name: 'Soil Fumigation',
    description: 'Fumigation techniques for soil pest control',
    slug: 'soil-fumigation'
  },
  {
    id: '22',
    name: 'Interior Plantscape',
    description: 'Pest control for indoor plants and interior landscaping',
    slug: 'interior-plantscape'
  },
  {
    id: '23',
    name: 'Park or School Pest Control',
    description: 'Pest management for parks, schools, and public spaces',
    slug: 'park-or-school-pest-control'
  },
  {
    id: '24',
    name: 'Swimming Pools',
    description: 'Pest control for swimming pools and aquatic facilities',
    slug: 'swimming-pools'
  },
  {
    id: '25',
    name: 'Aerial Applicator',
    description: 'Aerial application of pesticides and pest control materials',
    slug: 'aerial-applicator'
  },
  {
    id: '26',
    name: 'Sewer Root Control',
    description: 'Control of root intrusion in sewer systems and underground utilities',
    slug: 'sewer-root-control'
  }
];

export const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner', color: 'green' },
  { id: 'intermediate', name: 'Intermediate', color: 'yellow' },
  { id: 'advanced', name: 'Advanced', color: 'red' }
];

export function getCategoryBySlug(slug) {
  return CERTIFICATION_CATEGORIES.find(cat => cat.slug === slug);
}

export function getCategoryById(id) {
  return CERTIFICATION_CATEGORIES.find(cat => cat.id === id);
}
