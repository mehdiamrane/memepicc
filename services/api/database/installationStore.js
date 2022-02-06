import { db } from "../initFirebase";

const undefinedToNull = (object) => {
  const objectCopy = { ...object };
  Object.keys(objectCopy).forEach((key) => {
    if (objectCopy[key] === undefined) {
      objectCopy[key] = null;
    }
  });

  return objectCopy;
};

const nullToUndefined = (object) => {
  const objectCopy = { ...object };
  Object.keys(objectCopy).forEach((key) => {
    if (objectCopy[key] === null) {
      objectCopy[key] = undefined;
    }
  });

  return objectCopy;
};

const formatDocId = ({ type, workId, userId }) => {
  const workspaceType = type === "team" ? "T" : "E";
  return `${workspaceType}ID_${workId}_UID_${userId}`;
};

// On slack app install
export const storeInstallation = async (installation) => {
  const installData = undefinedToNull(installation);

  if (
    installation.isEnterpriseInstall &&
    installation.enterprise !== undefined
  ) {
    // support for org-wide app installation
    const docId = formatDocId({
      type: "enterprise",
      workId: installation.enterprise.id,
      userId: installation.user.id,
    });

    const res = await db
      .collection("slackInstallations")
      .doc(docId)
      .set(installData);

    return res;
  }
  if (installation.team !== undefined) {
    // single team app installation
    const docId = formatDocId({
      type: "team",
      workId: installation.team.id,
      userId: installation.user.id,
    });

    const res = await db
      .collection("slackInstallations")
      .doc(docId)
      .set(installData);

    return res;
  }
  throw new Error("Failed saving installation data to installationStore");
};

// When slack app is making a request
export const fetchInstallation = async (installQuery) => {
  console.log("fetchInstallation");

  if (
    installQuery.isEnterpriseInstall &&
    installQuery.enterpriseId !== undefined
  ) {
    // org wide app installation lookup
    const docId = formatDocId({
      type: "enterprise",
      workId: installQuery.enterpriseId,
      userId: installQuery.userId,
    });

    const res = await db.collection("slackInstallations").doc(docId).get();

    return nullToUndefined(res.data());
  }
  if (installQuery.teamId !== undefined) {
    // single team app installation lookup
    const docId = formatDocId({
      type: "team",
      workId: installQuery.teamId,
      userId: installQuery.userId,
    });

    console.log("getting slackInstallations");

    const res = await db.collection("slackInstallations").doc(docId).get();

    console.log("retuns slackInstallations");

    return nullToUndefined(res.data());
  }
  throw new Error("Failed fetching installation");
};

// TODO complete this part with correct docIds and correct event handling in /slack/events

// When slack app is uninstalled
export const deleteInstallation = async (installQuery) => {
  // change the lines below so they delete from your database
  if (
    installQuery.isEnterpriseInstall &&
    installQuery.enterpriseId !== undefined
  ) {
    // org wide app installation deletion
    const res = await db
      .collection("slackInstallations")
      .doc(installQuery.enterpriseId)
      .delete();

    return res;
  }
  if (installQuery.teamId !== undefined) {
    // single team app installation deletion
    const res = await db
      .collection("slackInstallations")
      .doc(installQuery.teamId)
      .delete();

    return res;
  }
  throw new Error("Failed to delete installation");
};
