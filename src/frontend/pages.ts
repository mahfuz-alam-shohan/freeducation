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
  ["/login", "login"],
  ["/register", "register"],
  ["/dashboard", "dashboard"],
  ["/dashboard/ssc", "admin-groups-ssc"],
  ["/dashboard/hsc", "admin-groups-hsc"],
  ["/dashboard/ssc/science", "admin-ssc-science"],
  ["/dashboard/ssc/humanities", "admin-ssc-humanities"],
  ["/dashboard/ssc/business-studies", "admin-ssc-business-studies"],
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
