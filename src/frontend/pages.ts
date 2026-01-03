import { renderAppHtml } from "./layout";

const viewByPath = new Map<string, string>([
  ["/", "landing"],
  ["/ssc", "ssc-subjects"],
  ["/hsc", "hsc-subjects"],
  ["/ssc/bangla-1st-paper", "public-bangla-ssc-1st-paper"],
  ["/hsc/bangla-1st-paper", "public-bangla-hsc-1st-paper"],
  ["/ssc/bangla-1st-paper/shahitto", "public-bangla-ssc-shahitto"],
  ["/hsc/bangla-1st-paper/shahitto", "public-bangla-hsc-shahitto"],
  ["/ssc/bangla-1st-paper/shohopath", "public-bangla-ssc-shohopath"],
  ["/hsc/bangla-1st-paper/shohopath", "public-bangla-hsc-shohopath"],
  ["/ssc/bangla-1st-paper/goddo", "public-bangla-ssc-goddo"],
  ["/ssc/bangla-1st-paper/poddo", "public-bangla-ssc-poddo"],
  ["/hsc/bangla-1st-paper/goddo", "public-bangla-hsc-goddo"],
  ["/hsc/bangla-1st-paper/poddo", "public-bangla-hsc-poddo"],
  ["/ssc/bangla-1st-paper/item/srijonshil", "public-bangla-ssc-srijonshil"],
  ["/hsc/bangla-1st-paper/item/srijonshil", "public-bangla-hsc-srijonshil"],
  ["/ssc/bangla-1st-paper/item/mcq", "public-bangla-ssc-mcq"],
  ["/hsc/bangla-1st-paper/item/mcq", "public-bangla-hsc-mcq"],
  ["/ssc/bangla-1st-paper/item", "public-bangla-ssc-item"],
  ["/hsc/bangla-1st-paper/item", "public-bangla-hsc-item"],
  ["/ssc/ict", "public-ssc-ict"],
  ["/ssc/ict/mcq", "public-ssc-ict-mcq"],
  ["/ssc/physics", "public-ssc-physics"],
  ["/ssc/physics/topics", "public-ssc-physics-topics"],
  ["/ssc/physics/topic", "public-ssc-physics-topic"],
  ["/ssc/physics/cq", "public-ssc-physics-cq"],
  ["/ssc/physics/mcq", "public-ssc-physics-mcq"],
  ["/ssc/chemistry", "public-ssc-chemistry"],
  ["/ssc/chemistry/topics", "public-ssc-chemistry-topics"],
  ["/ssc/chemistry/topic", "public-ssc-chemistry-topic"],
  ["/ssc/chemistry/cq", "public-ssc-chemistry-cq"],
  ["/ssc/chemistry/mcq", "public-ssc-chemistry-mcq"],
  ["/ssc/biology", "public-ssc-biology"],
  ["/ssc/biology/topics", "public-ssc-biology-topics"],
  ["/ssc/biology/topic", "public-ssc-biology-topic"],
  ["/ssc/biology/cq", "public-ssc-biology-cq"],
  ["/ssc/biology/mcq", "public-ssc-biology-mcq"],
  ["/hsc/physics-1st-paper", "public-hsc-physics-1st"],
  ["/hsc/physics-1st-paper/topics", "public-hsc-physics-1st-topics"],
  ["/hsc/physics-1st-paper/topic", "public-hsc-physics-1st-topic"],
  ["/hsc/physics-1st-paper/cq", "public-hsc-physics-1st-cq"],
  ["/hsc/physics-1st-paper/mcq", "public-hsc-physics-1st-mcq"],
  ["/hsc/physics-2nd-paper", "public-hsc-physics-2nd"],
  ["/hsc/physics-2nd-paper/topics", "public-hsc-physics-2nd-topics"],
  ["/hsc/physics-2nd-paper/topic", "public-hsc-physics-2nd-topic"],
  ["/hsc/physics-2nd-paper/cq", "public-hsc-physics-2nd-cq"],
  ["/hsc/physics-2nd-paper/mcq", "public-hsc-physics-2nd-mcq"],
  ["/hsc/chemistry-1st-paper", "public-hsc-chemistry-1st"],
  ["/hsc/chemistry-1st-paper/topics", "public-hsc-chemistry-1st-topics"],
  ["/hsc/chemistry-1st-paper/topic", "public-hsc-chemistry-1st-topic"],
  ["/hsc/chemistry-1st-paper/cq", "public-hsc-chemistry-1st-cq"],
  ["/hsc/chemistry-1st-paper/mcq", "public-hsc-chemistry-1st-mcq"],
  ["/hsc/chemistry-2nd-paper", "public-hsc-chemistry-2nd"],
  ["/hsc/chemistry-2nd-paper/topics", "public-hsc-chemistry-2nd-topics"],
  ["/hsc/chemistry-2nd-paper/topic", "public-hsc-chemistry-2nd-topic"],
  ["/hsc/chemistry-2nd-paper/cq", "public-hsc-chemistry-2nd-cq"],
  ["/hsc/chemistry-2nd-paper/mcq", "public-hsc-chemistry-2nd-mcq"],
  ["/hsc/biology-1st-paper", "public-hsc-biology-1st"],
  ["/hsc/biology-1st-paper/topics", "public-hsc-biology-1st-topics"],
  ["/hsc/biology-1st-paper/topic", "public-hsc-biology-1st-topic"],
  ["/hsc/biology-1st-paper/cq", "public-hsc-biology-1st-cq"],
  ["/hsc/biology-1st-paper/mcq", "public-hsc-biology-1st-mcq"],
  ["/hsc/biology-2nd-paper", "public-hsc-biology-2nd"],
  ["/hsc/biology-2nd-paper/topics", "public-hsc-biology-2nd-topics"],
  ["/hsc/biology-2nd-paper/topic", "public-hsc-biology-2nd-topic"],
  ["/hsc/biology-2nd-paper/cq", "public-hsc-biology-2nd-cq"],
  ["/hsc/biology-2nd-paper/mcq", "public-hsc-biology-2nd-mcq"],
  ["/hsc/english-1st-paper", "public-english-hsc-1st-paper"],
  ["/hsc/english-1st-paper/reading", "public-english-hsc-reading"],
  ["/hsc/english-1st-paper/writing", "public-english-hsc-writing"],
  ["/hsc/english-1st-paper/subtypes", "public-english-hsc-subtypes"],
  ["/hsc/english-1st-paper/questions", "public-english-hsc-questions"],
  ["/login", "login"],
  ["/register", "register"],
  ["/dashboard", "dashboard"],
  ["/dashboard/ssc", "admin-groups-ssc"],
  ["/dashboard/hsc", "admin-groups-hsc"],
  ["/dashboard/ssc/science", "admin-ssc-science"],
  ["/dashboard/ssc/humanities", "admin-ssc-humanities"],
  ["/dashboard/ssc/business-studies", "admin-ssc-business-studies"],
  ["/dashboard/ssc/ict", "admin-ssc-ict"],
  ["/dashboard/ssc/ict/mcq", "admin-ssc-ict-mcq"],
  ["/dashboard/ssc/physics", "admin-ssc-physics"],
  ["/dashboard/ssc/physics/topics", "admin-ssc-physics-topics"],
  ["/dashboard/ssc/physics/topic", "admin-ssc-physics-topic"],
  ["/dashboard/ssc/physics/cq", "admin-ssc-physics-cq-types"],
  ["/dashboard/ssc/physics/cq/questions", "admin-ssc-physics-cq-questions"],
  ["/dashboard/ssc/physics/mcq", "admin-ssc-physics-mcq"],
  ["/dashboard/ssc/chemistry", "admin-ssc-chemistry"],
  ["/dashboard/ssc/chemistry/topics", "admin-ssc-chemistry-topics"],
  ["/dashboard/ssc/chemistry/topic", "admin-ssc-chemistry-topic"],
  ["/dashboard/ssc/chemistry/cq", "admin-ssc-chemistry-cq-types"],
  ["/dashboard/ssc/chemistry/cq/questions", "admin-ssc-chemistry-cq-questions"],
  ["/dashboard/ssc/chemistry/mcq", "admin-ssc-chemistry-mcq"],
  ["/dashboard/ssc/biology", "admin-ssc-biology"],
  ["/dashboard/ssc/biology/topics", "admin-ssc-biology-topics"],
  ["/dashboard/ssc/biology/topic", "admin-ssc-biology-topic"],
  ["/dashboard/ssc/biology/cq", "admin-ssc-biology-cq-types"],
  ["/dashboard/ssc/biology/cq/questions", "admin-ssc-biology-cq-questions"],
  ["/dashboard/ssc/biology/mcq", "admin-ssc-biology-mcq"],
  ["/dashboard/hsc/physics-1st-paper", "admin-hsc-physics-1st"],
  ["/dashboard/hsc/physics-1st-paper/topics", "admin-hsc-physics-1st-topics"],
  ["/dashboard/hsc/physics-1st-paper/topic", "admin-hsc-physics-1st-topic"],
  ["/dashboard/hsc/physics-1st-paper/cq", "admin-hsc-physics-1st-cq-types"],
  ["/dashboard/hsc/physics-1st-paper/cq/questions", "admin-hsc-physics-1st-cq-questions"],
  ["/dashboard/hsc/physics-1st-paper/mcq", "admin-hsc-physics-1st-mcq"],
  ["/dashboard/hsc/physics-2nd-paper", "admin-hsc-physics-2nd"],
  ["/dashboard/hsc/physics-2nd-paper/topics", "admin-hsc-physics-2nd-topics"],
  ["/dashboard/hsc/physics-2nd-paper/topic", "admin-hsc-physics-2nd-topic"],
  ["/dashboard/hsc/physics-2nd-paper/cq", "admin-hsc-physics-2nd-cq-types"],
  ["/dashboard/hsc/physics-2nd-paper/cq/questions", "admin-hsc-physics-2nd-cq-questions"],
  ["/dashboard/hsc/physics-2nd-paper/mcq", "admin-hsc-physics-2nd-mcq"],
  ["/dashboard/hsc/chemistry-1st-paper", "admin-hsc-chemistry-1st"],
  ["/dashboard/hsc/chemistry-1st-paper/topics", "admin-hsc-chemistry-1st-topics"],
  ["/dashboard/hsc/chemistry-1st-paper/topic", "admin-hsc-chemistry-1st-topic"],
  ["/dashboard/hsc/chemistry-1st-paper/cq", "admin-hsc-chemistry-1st-cq-types"],
  ["/dashboard/hsc/chemistry-1st-paper/cq/questions", "admin-hsc-chemistry-1st-cq-questions"],
  ["/dashboard/hsc/chemistry-1st-paper/mcq", "admin-hsc-chemistry-1st-mcq"],
  ["/dashboard/hsc/chemistry-2nd-paper", "admin-hsc-chemistry-2nd"],
  ["/dashboard/hsc/chemistry-2nd-paper/topics", "admin-hsc-chemistry-2nd-topics"],
  ["/dashboard/hsc/chemistry-2nd-paper/topic", "admin-hsc-chemistry-2nd-topic"],
  ["/dashboard/hsc/chemistry-2nd-paper/cq", "admin-hsc-chemistry-2nd-cq-types"],
  ["/dashboard/hsc/chemistry-2nd-paper/cq/questions", "admin-hsc-chemistry-2nd-cq-questions"],
  ["/dashboard/hsc/chemistry-2nd-paper/mcq", "admin-hsc-chemistry-2nd-mcq"],
  ["/dashboard/hsc/biology-1st-paper", "admin-hsc-biology-1st"],
  ["/dashboard/hsc/biology-1st-paper/topics", "admin-hsc-biology-1st-topics"],
  ["/dashboard/hsc/biology-1st-paper/topic", "admin-hsc-biology-1st-topic"],
  ["/dashboard/hsc/biology-1st-paper/cq", "admin-hsc-biology-1st-cq-types"],
  ["/dashboard/hsc/biology-1st-paper/cq/questions", "admin-hsc-biology-1st-cq-questions"],
  ["/dashboard/hsc/biology-1st-paper/mcq", "admin-hsc-biology-1st-mcq"],
  ["/dashboard/hsc/biology-2nd-paper", "admin-hsc-biology-2nd"],
  ["/dashboard/hsc/biology-2nd-paper/topics", "admin-hsc-biology-2nd-topics"],
  ["/dashboard/hsc/biology-2nd-paper/topic", "admin-hsc-biology-2nd-topic"],
  ["/dashboard/hsc/biology-2nd-paper/cq", "admin-hsc-biology-2nd-cq-types"],
  ["/dashboard/hsc/biology-2nd-paper/cq/questions", "admin-hsc-biology-2nd-cq-questions"],
  ["/dashboard/hsc/biology-2nd-paper/mcq", "admin-hsc-biology-2nd-mcq"],
  ["/dashboard/hsc/science", "admin-hsc-science"],
  ["/dashboard/hsc/humanities", "admin-hsc-humanities"],
  ["/dashboard/hsc/business-studies", "admin-hsc-business-studies"],
  ["/dashboard/settings", "admin-settings"],
  ["/dashboard/ssc/bangla-1st-paper", "bangla-ssc-1st-paper"],
  ["/dashboard/hsc/bangla-1st-paper", "bangla-hsc-1st-paper"],
  ["/dashboard/ssc/bangla-1st-paper/shahitto", "bangla-ssc-shahitto"],
  ["/dashboard/hsc/bangla-1st-paper/shahitto", "bangla-hsc-shahitto"],
  ["/dashboard/ssc/bangla-1st-paper/shohopath", "bangla-ssc-shohopath"],
  ["/dashboard/hsc/bangla-1st-paper/shohopath", "bangla-hsc-shohopath"],
  ["/dashboard/ssc/bangla-1st-paper/goddo", "bangla-ssc-goddo"],
  ["/dashboard/ssc/bangla-1st-paper/poddo", "bangla-ssc-poddo"],
  ["/dashboard/hsc/bangla-1st-paper/goddo", "bangla-hsc-goddo"],
  ["/dashboard/hsc/bangla-1st-paper/poddo", "bangla-hsc-poddo"],
  ["/dashboard/ssc/bangla-1st-paper/item", "bangla-ssc-item"],
  ["/dashboard/hsc/bangla-1st-paper/item", "bangla-hsc-item"],
  ["/dashboard/ssc/bangla-1st-paper/item/srijonshil", "bangla-ssc-srijonshil-types"],
  ["/dashboard/hsc/bangla-1st-paper/item/srijonshil", "bangla-hsc-srijonshil-types"],
  ["/dashboard/ssc/bangla-1st-paper/item/srijonshil/questions", "bangla-ssc-srijonshil-questions"],
  ["/dashboard/hsc/bangla-1st-paper/item/srijonshil/questions", "bangla-hsc-srijonshil-questions"],
  ["/dashboard/ssc/bangla-1st-paper/item/mcq", "bangla-ssc-mcq"],
  ["/dashboard/hsc/bangla-1st-paper/item/mcq", "bangla-hsc-mcq"],
  ["/dashboard/hsc/english-1st-paper", "english-hsc-1st-paper"],
  ["/dashboard/hsc/english-1st-paper/reading", "english-hsc-reading"],
  ["/dashboard/hsc/english-1st-paper/writing", "english-hsc-writing"],
  ["/dashboard/hsc/english-1st-paper/subtypes", "english-hsc-subtypes"],
  ["/dashboard/hsc/english-1st-paper/questions", "english-hsc-questions"],
]);

export function getFrontendHtml(pathname: string) {
  if (pathname.startsWith("/login")) {
    return renderAppHtml("login");
  }
  if (pathname.startsWith("/register")) {
    return renderAppHtml("register");
  }
  if (pathname.startsWith("/dashboard")) {
    if (pathname.startsWith("/dashboard/settings")) {
      return renderAppHtml("admin-settings");
    }
    if (pathname.startsWith("/dashboard/hsc/english-1st-paper/questions")) {
      return renderAppHtml("english-hsc-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/english-1st-paper/subtypes")) {
      return renderAppHtml("english-hsc-subtypes");
    }
    if (pathname.startsWith("/dashboard/hsc/english-1st-paper/reading")) {
      return renderAppHtml("english-hsc-reading");
    }
    if (pathname.startsWith("/dashboard/hsc/english-1st-paper/writing")) {
      return renderAppHtml("english-hsc-writing");
    }
    if (pathname.startsWith("/dashboard/hsc/english-1st-paper")) {
      return renderAppHtml("english-hsc-1st-paper");
    }
    if (pathname.startsWith("/dashboard/ssc/ict/mcq")) {
      return renderAppHtml("admin-ssc-ict-mcq");
    }
    if (pathname.startsWith("/dashboard/ssc/ict")) {
      return renderAppHtml("admin-ssc-ict");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-1st-paper/cq/questions")) {
      return renderAppHtml("admin-hsc-physics-1st-cq-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-1st-paper/cq")) {
      return renderAppHtml("admin-hsc-physics-1st-cq-types");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-1st-paper/mcq")) {
      return renderAppHtml("admin-hsc-physics-1st-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-1st-paper/topic")) {
      return renderAppHtml("admin-hsc-physics-1st-topic");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-1st-paper/topics")) {
      return renderAppHtml("admin-hsc-physics-1st-topics");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-1st-paper")) {
      return renderAppHtml("admin-hsc-physics-1st");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-2nd-paper/cq/questions")) {
      return renderAppHtml("admin-hsc-physics-2nd-cq-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-2nd-paper/cq")) {
      return renderAppHtml("admin-hsc-physics-2nd-cq-types");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-2nd-paper/mcq")) {
      return renderAppHtml("admin-hsc-physics-2nd-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-2nd-paper/topic")) {
      return renderAppHtml("admin-hsc-physics-2nd-topic");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-2nd-paper/topics")) {
      return renderAppHtml("admin-hsc-physics-2nd-topics");
    }
    if (pathname.startsWith("/dashboard/hsc/physics-2nd-paper")) {
      return renderAppHtml("admin-hsc-physics-2nd");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-1st-paper/cq/questions")) {
      return renderAppHtml("admin-hsc-chemistry-1st-cq-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-1st-paper/cq")) {
      return renderAppHtml("admin-hsc-chemistry-1st-cq-types");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-1st-paper/mcq")) {
      return renderAppHtml("admin-hsc-chemistry-1st-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-1st-paper/topic")) {
      return renderAppHtml("admin-hsc-chemistry-1st-topic");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-1st-paper/topics")) {
      return renderAppHtml("admin-hsc-chemistry-1st-topics");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-1st-paper")) {
      return renderAppHtml("admin-hsc-chemistry-1st");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-2nd-paper/cq/questions")) {
      return renderAppHtml("admin-hsc-chemistry-2nd-cq-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-2nd-paper/cq")) {
      return renderAppHtml("admin-hsc-chemistry-2nd-cq-types");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-2nd-paper/mcq")) {
      return renderAppHtml("admin-hsc-chemistry-2nd-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-2nd-paper/topic")) {
      return renderAppHtml("admin-hsc-chemistry-2nd-topic");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-2nd-paper/topics")) {
      return renderAppHtml("admin-hsc-chemistry-2nd-topics");
    }
    if (pathname.startsWith("/dashboard/hsc/chemistry-2nd-paper")) {
      return renderAppHtml("admin-hsc-chemistry-2nd");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-1st-paper/cq/questions")) {
      return renderAppHtml("admin-hsc-biology-1st-cq-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-1st-paper/cq")) {
      return renderAppHtml("admin-hsc-biology-1st-cq-types");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-1st-paper/mcq")) {
      return renderAppHtml("admin-hsc-biology-1st-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-1st-paper/topic")) {
      return renderAppHtml("admin-hsc-biology-1st-topic");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-1st-paper/topics")) {
      return renderAppHtml("admin-hsc-biology-1st-topics");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-1st-paper")) {
      return renderAppHtml("admin-hsc-biology-1st");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-2nd-paper/cq/questions")) {
      return renderAppHtml("admin-hsc-biology-2nd-cq-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-2nd-paper/cq")) {
      return renderAppHtml("admin-hsc-biology-2nd-cq-types");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-2nd-paper/mcq")) {
      return renderAppHtml("admin-hsc-biology-2nd-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-2nd-paper/topic")) {
      return renderAppHtml("admin-hsc-biology-2nd-topic");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-2nd-paper/topics")) {
      return renderAppHtml("admin-hsc-biology-2nd-topics");
    }
    if (pathname.startsWith("/dashboard/hsc/biology-2nd-paper")) {
      return renderAppHtml("admin-hsc-biology-2nd");
    }
    if (pathname.startsWith("/dashboard/ssc/physics/cq/questions")) {
      return renderAppHtml("admin-ssc-physics-cq-questions");
    }
    if (pathname.startsWith("/dashboard/ssc/physics/cq")) {
      return renderAppHtml("admin-ssc-physics-cq-types");
    }
    if (pathname.startsWith("/dashboard/ssc/physics/mcq")) {
      return renderAppHtml("admin-ssc-physics-mcq");
    }
    if (pathname.startsWith("/dashboard/ssc/physics/topic")) {
      return renderAppHtml("admin-ssc-physics-topic");
    }
    if (pathname.startsWith("/dashboard/ssc/physics/topics")) {
      return renderAppHtml("admin-ssc-physics-topics");
    }
    if (pathname.startsWith("/dashboard/ssc/physics")) {
      return renderAppHtml("admin-ssc-physics");
    }
    if (pathname.startsWith("/dashboard/ssc/chemistry/cq/questions")) {
      return renderAppHtml("admin-ssc-chemistry-cq-questions");
    }
    if (pathname.startsWith("/dashboard/ssc/chemistry/cq")) {
      return renderAppHtml("admin-ssc-chemistry-cq-types");
    }
    if (pathname.startsWith("/dashboard/ssc/chemistry/mcq")) {
      return renderAppHtml("admin-ssc-chemistry-mcq");
    }
    if (pathname.startsWith("/dashboard/ssc/chemistry/topic")) {
      return renderAppHtml("admin-ssc-chemistry-topic");
    }
    if (pathname.startsWith("/dashboard/ssc/chemistry/topics")) {
      return renderAppHtml("admin-ssc-chemistry-topics");
    }
    if (pathname.startsWith("/dashboard/ssc/chemistry")) {
      return renderAppHtml("admin-ssc-chemistry");
    }
    if (pathname.startsWith("/dashboard/ssc/biology/cq/questions")) {
      return renderAppHtml("admin-ssc-biology-cq-questions");
    }
    if (pathname.startsWith("/dashboard/ssc/biology/cq")) {
      return renderAppHtml("admin-ssc-biology-cq-types");
    }
    if (pathname.startsWith("/dashboard/ssc/biology/mcq")) {
      return renderAppHtml("admin-ssc-biology-mcq");
    }
    if (pathname.startsWith("/dashboard/ssc/biology/topic")) {
      return renderAppHtml("admin-ssc-biology-topic");
    }
    if (pathname.startsWith("/dashboard/ssc/biology/topics")) {
      return renderAppHtml("admin-ssc-biology-topics");
    }
    if (pathname.startsWith("/dashboard/ssc/biology")) {
      return renderAppHtml("admin-ssc-biology");
    }
    if (pathname.startsWith("/dashboard/ssc/science")) {
      return renderAppHtml("admin-ssc-science");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/item/srijonshil/questions")) {
      return renderAppHtml("bangla-ssc-srijonshil-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/item/srijonshil/questions")) {
      return renderAppHtml("bangla-hsc-srijonshil-questions");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/item/srijonshil")) {
      return renderAppHtml("bangla-ssc-srijonshil-types");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/item/srijonshil")) {
      return renderAppHtml("bangla-hsc-srijonshil-types");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/item/mcq")) {
      return renderAppHtml("bangla-ssc-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/item/mcq")) {
      return renderAppHtml("bangla-hsc-mcq");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/item")) {
      return renderAppHtml("bangla-ssc-item");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/item")) {
      return renderAppHtml("bangla-hsc-item");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/goddo")) {
      return renderAppHtml("bangla-ssc-goddo");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/poddo")) {
      return renderAppHtml("bangla-ssc-poddo");
    }
    if (
      pathname.startsWith("/dashboard/ssc/bangla-1st-paper/natok") ||
      pathname.startsWith("/dashboard/ssc/bangla-1st-paper/upannyas")
    ) {
      return renderAppHtml("bangla-ssc-shohopath");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/goddo")) {
      return renderAppHtml("bangla-hsc-goddo");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/poddo")) {
      return renderAppHtml("bangla-hsc-poddo");
    }
    if (
      pathname.startsWith("/dashboard/hsc/bangla-1st-paper/natok") ||
      pathname.startsWith("/dashboard/hsc/bangla-1st-paper/upannyas")
    ) {
      return renderAppHtml("bangla-hsc-shohopath");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/shahitto")) {
      return renderAppHtml("bangla-ssc-shahitto");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/shahitto")) {
      return renderAppHtml("bangla-hsc-shahitto");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/shohopath")) {
      return renderAppHtml("bangla-ssc-shohopath");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/shohopath")) {
      return renderAppHtml("bangla-hsc-shohopath");
    }
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper")) {
      return renderAppHtml("bangla-ssc-1st-paper");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper")) {
      return renderAppHtml("bangla-hsc-1st-paper");
    }
    if (pathname.startsWith("/dashboard/ssc/humanities")) {
      return renderAppHtml("admin-ssc-humanities");
    }
    if (pathname.startsWith("/dashboard/ssc/business-studies")) {
      return renderAppHtml("admin-ssc-business-studies");
    }
    if (pathname.startsWith("/dashboard/hsc/science")) {
      return renderAppHtml("admin-hsc-science");
    }
    if (pathname.startsWith("/dashboard/hsc/humanities")) {
      return renderAppHtml("admin-hsc-humanities");
    }
    if (pathname.startsWith("/dashboard/hsc/business-studies")) {
      return renderAppHtml("admin-hsc-business-studies");
    }
    if (pathname.startsWith("/dashboard/ssc")) {
      return renderAppHtml("admin-groups-ssc");
    }
    if (pathname.startsWith("/dashboard/hsc")) {
      return renderAppHtml("admin-groups-hsc");
    }
    return renderAppHtml("dashboard");
  }
  const view = viewByPath.get(pathname) ?? "landing";
  return renderAppHtml(view);
}
