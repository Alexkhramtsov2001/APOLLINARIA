import { SKILLS, TOOLS } from '../js/data/skills.js';
import { PROJECTS } from '../js/data/projects.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(SKILLS.length === 4, 'Expected 4 skills');
assert(TOOLS.length === 6, 'Expected 6 tools');
assert(PROJECTS.length === 3, 'Expected 3 projects');
assert(new Set(SKILLS.map((skill) => skill.number)).size === SKILLS.length, 'Skill numbers must be unique');
assert(new Set(PROJECTS.map((project) => project.number)).size === PROJECTS.length, 'Project numbers must be unique');
console.log('Runtime data check passed.');
