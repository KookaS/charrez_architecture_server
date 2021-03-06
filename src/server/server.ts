import {
    addToProject,
    authorization,
    createProject,
    loadAllCollections,
    loadImage, loadProject, loadProjectMetadata,
    removeCollection, removeDocument,
    serverStart
} from "@server/routes";

// has all the possible requests
export const serverInit = () => {
    try {
        serverStart();
        loadImage();
        authorization();

        createProject("accueil");
        loadAllCollections("accueil");
        removeCollection("accueil");

        createProject("villas");
        loadProjectMetadata("villas");
        loadAllCollections("villas");
        addToProject("villas");
        loadProject("villas");
        removeCollection("villas");
        removeDocument("villas");

        createProject("immeubles");
        loadProjectMetadata("immeubles");
        loadAllCollections("immeubles");
        addToProject("immeubles");
        loadProject("immeubles");
        removeCollection("immeubles");
        removeDocument("immeubles");

        createProject("urbanisme");
        loadProjectMetadata("urbanisme");
        loadAllCollections("urbanisme");
        addToProject("urbanisme");
        loadProject("urbanisme");
        removeCollection("urbanisme");
        removeDocument("urbanisme");
    } catch (err) {
        console.log(err.message)
    }
}