import {
    addToProject,
    authorization,
    createProject,
    loadAllCollections,
    loadImage, loadProject, loadProjectMetadata,
    removeCollection, removeDocument,
    serverStart
} from "@server/routes";
import {MongoHelper} from "@database/helper";

// has all the possible requests
export const serverInit = async () => {
    try {
        serverStart();
        await MongoHelper.create("acceuil");
        await MongoHelper.create("villas");
        await MongoHelper.create("immeubles");
        await MongoHelper.create("urbanisme");
        await MongoHelper.connect();
        console.log("Connected to mongoDB!")
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
        throw err
    }
}