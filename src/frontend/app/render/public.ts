import { renderLanding } from "./public/landing";
import { renderIct } from "./public/ict";
import { renderPhysics } from "./public/physics";
import { renderChemistry } from "./public/chemistry";
import { renderBiology } from "./public/biology";
import { renderHumanities } from "./public/humanities";
import { renderBangla } from "./public/bangla";
import { renderEnglish } from "./public/english";

export const renderPublic = `
${renderLanding}
${renderIct}
${renderPhysics}
${renderChemistry}
${renderBiology}
${renderHumanities}
${renderBangla}
${renderEnglish}
`;
