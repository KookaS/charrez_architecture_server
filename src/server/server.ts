import {mongoConnect} from "@database/mongo";
import {
    addToProject,
    authorization,
    createProject,
    loadAllCollections,
    loadImage, loadProject, loadProjectMetadata,
    removeCollection, removeDocument,
    serverStart
} from "@server/routes";


export const serverInit = () => {
    try {
        serverStart();
        mongoConnect();
        loadImage();
        authorization();

        createProject("acceuil");
        loadAllCollections("acceuil");
        removeCollection("acceuil");

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
    }
}