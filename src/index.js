// TODO: does es6 change any of this? Need to ask chradek.
//import { LogsClient } from "@azure/monitor-query";
import { MetricsClient } from "@azure/monitor-query";
import { InteractiveBrowserCredential } from "@azure/identity";

export async function queryLogs() {
  const credential = new InteractiveBrowserCredential();
  //  const logsClient = new LogsClient(credential);
  //  const result = await logsClient.queryLogs("workspaceId", "AppEvents");
  const metricsClient = new MetricsClient(credential);
  const result = await metricsClient.getMetricDefinitions("resourceUri");
  return result;
}

window.addEventListener("DOMContentLoaded", () => {
  const listContainersButton = document.getElementById("queryLogs");
  listContainersButton.addEventListener("click", () => queryLogs());
});
