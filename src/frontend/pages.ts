import { renderAppHtml } from "./layout";
import { viewByPath } from "./routes/view-map";

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
    if (pathname.startsWith("/dashboard/ssc/ict/videos")) {
      return renderAppHtml("admin-ssc-ict-videos");
    }
    if (pathname.startsWith("/dashboard/ssc/ict")) {
      return renderAppHtml("admin-ssc-ict");
    }
    if (pathname.startsWith("/dashboard/hsc/ict/mcq")) {
      return renderAppHtml("admin-hsc-ict-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/ict/videos")) {
      return renderAppHtml("admin-hsc-ict-videos");
    }
    if (pathname.startsWith("/dashboard/hsc/ict/cq/questions")) {
      return renderAppHtml("admin-hsc-ict-cq-questions");
    }
    if (pathname.startsWith("/dashboard/hsc/ict/cq")) {
      return renderAppHtml("admin-hsc-ict-cq-types");
    }
    if (pathname.startsWith("/dashboard/hsc/ict/topics")) {
      return renderAppHtml("admin-hsc-ict-topics");
    }
    if (pathname.startsWith("/dashboard/hsc/ict/topic")) {
      return renderAppHtml("admin-hsc-ict-topic");
    }
    if (pathname.startsWith("/dashboard/hsc/ict")) {
      return renderAppHtml("admin-hsc-ict");
    }
    if (
      pathname.startsWith(
        "/dashboard/ssc/bangladesh-and-global-studies/cq/questions"
      )
    ) {
      return renderAppHtml("admin-ssc-bangladesh-global-studies-cq-questions");
    }
    if (pathname.startsWith("/dashboard/ssc/bangladesh-and-global-studies/cq")) {
      return renderAppHtml("admin-ssc-bangladesh-global-studies-cq-types");
    }
    if (
      pathname.startsWith("/dashboard/ssc/bangladesh-and-global-studies/mcq")
    ) {
      return renderAppHtml("admin-ssc-bangladesh-global-studies-mcq");
    }
    if (
      pathname.startsWith("/dashboard/ssc/bangladesh-and-global-studies/videos")
    ) {
      return renderAppHtml("admin-ssc-bangladesh-global-studies-videos");
    }
    if (
      pathname.startsWith("/dashboard/ssc/bangladesh-and-global-studies/topic")
    ) {
      return renderAppHtml("admin-ssc-bangladesh-global-studies-topic");
    }
    if (
      pathname.startsWith("/dashboard/ssc/bangladesh-and-global-studies/topics")
    ) {
      return renderAppHtml("admin-ssc-bangladesh-global-studies-topics");
    }
    if (
      pathname.startsWith("/dashboard/ssc/bangladesh-and-global-studies")
    ) {
      return renderAppHtml("admin-ssc-bangladesh-global-studies");
    }
    if (
      pathname.startsWith(
        "/dashboard/ssc/religion-and-moral-education/cq/questions"
      )
    ) {
      return renderAppHtml("admin-ssc-religion-cq-questions");
    }
    if (
      pathname.startsWith("/dashboard/ssc/religion-and-moral-education/cq")
    ) {
      return renderAppHtml("admin-ssc-religion-cq-types");
    }
    if (
      pathname.startsWith("/dashboard/ssc/religion-and-moral-education/mcq")
    ) {
      return renderAppHtml("admin-ssc-religion-mcq");
    }
    if (
      pathname.startsWith("/dashboard/ssc/religion-and-moral-education/videos")
    ) {
      return renderAppHtml("admin-ssc-religion-videos");
    }
    if (
      pathname.startsWith("/dashboard/ssc/religion-and-moral-education/topic")
    ) {
      return renderAppHtml("admin-ssc-religion-topic");
    }
    if (
      pathname.startsWith("/dashboard/ssc/religion-and-moral-education/topics")
    ) {
      return renderAppHtml("admin-ssc-religion-topics");
    }
    if (
      pathname.startsWith(
        "/dashboard/ssc/religion-and-moral-education/chapters"
      )
    ) {
      return renderAppHtml("admin-ssc-religion-chapters");
    }
    if (
      pathname.startsWith("/dashboard/ssc/religion-and-moral-education")
    ) {
      return renderAppHtml("admin-ssc-religion");
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
    if (pathname.startsWith("/dashboard/hsc/physics-1st-paper/videos")) {
      return renderAppHtml("admin-hsc-physics-1st-videos");
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
    if (pathname.startsWith("/dashboard/hsc/physics-2nd-paper/videos")) {
      return renderAppHtml("admin-hsc-physics-2nd-videos");
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
    if (pathname.startsWith("/dashboard/hsc/chemistry-1st-paper/videos")) {
      return renderAppHtml("admin-hsc-chemistry-1st-videos");
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
    if (pathname.startsWith("/dashboard/hsc/chemistry-2nd-paper/videos")) {
      return renderAppHtml("admin-hsc-chemistry-2nd-videos");
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
    if (pathname.startsWith("/dashboard/hsc/biology-1st-paper/videos")) {
      return renderAppHtml("admin-hsc-biology-1st-videos");
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
    if (pathname.startsWith("/dashboard/hsc/biology-2nd-paper/videos")) {
      return renderAppHtml("admin-hsc-biology-2nd-videos");
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
    if (pathname.startsWith("/dashboard/ssc/physics/videos")) {
      return renderAppHtml("admin-ssc-physics-videos");
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
    if (pathname.startsWith("/dashboard/ssc/chemistry/videos")) {
      return renderAppHtml("admin-ssc-chemistry-videos");
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
    if (pathname.startsWith("/dashboard/ssc/biology/videos")) {
      return renderAppHtml("admin-ssc-biology-videos");
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
    if (pathname.startsWith("/dashboard/ssc/bangla-1st-paper/item/videos")) {
      return renderAppHtml("bangla-ssc-videos");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/item/mcq")) {
      return renderAppHtml("bangla-hsc-mcq");
    }
    if (pathname.startsWith("/dashboard/hsc/bangla-1st-paper/item/videos")) {
      return renderAppHtml("bangla-hsc-videos");
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
