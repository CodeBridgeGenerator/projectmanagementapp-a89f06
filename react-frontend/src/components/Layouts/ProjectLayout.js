import AppSideBar from "./appSideBar/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import ProjectsPage from "../ProjectsPage/ProjectsPage";
import TasksPage from "../TasksPage/TasksPage";
import SubtasksPage from "../SubtasksPage/SubtasksPage";
import TimelogsPage from "../TimelogsPage/TimelogsPage";
import TeamsPage from "../TeamsPage/TeamsPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "projects":
                return <ProjectsPage />;
case "tasks":
                return <TasksPage />;
case "subtasks":
                return <SubtasksPage />;
case "timelogs":
                return <TimelogsPage />;
case "teams":
                return <TeamsPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;
