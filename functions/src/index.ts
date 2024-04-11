/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as logger from 'firebase-functions/logger';
import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();

// const cors: (string | RegExp)[] = ["miss1.github.io"];
const cors = true;

export const queryTrips = onRequest({cors: cors}, async (request, response) => {
  // logger.info("Hello logs!", {structuredData: true});
  try {
    const type = request.query.type as string;
    let querySnapshot;

    if (type) {
      querySnapshot = await getFirestore().collection("trip")
        .where("type", "==", type).get();
    } else {
      querySnapshot = await getFirestore().collection("trip").get();
    }

    const documents: unknown[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    response.json(documents);
  } catch (error) {
    console.error("Error getting documents:", error);
    response.status(500).send("Error getting Trips");
  }
});

export const queryTrip = onRequest({cors: cors}, async (request, response) => {
  try {
    const id = request.query.id as string;

    if (!id) {
      response.status(400).send("Trip id is required");
      return;
    }

    const snapshot = await getFirestore().collection("trip").doc(id).get();

    if (!snapshot.exists) {
      response.status(404).send("Trip not found");
      return;
    }

    response.json({id: snapshot.id, ...snapshot.data()});
  } catch (error) {
    console.error("Error getting documents:", error);
    response.status(500).send("Error getting Trip");
  }
});

export const updateTrip = onRequest({cors: cors}, async (request, response) => {
  try {
    const id = request.query.id as string;
    const newData = request.body;

    if (!id) {
      response.status(400).send("Trip id is required");
      return;
    }

    await getFirestore().collection("trip").doc(id).update(newData);

    response.status(200).send("update successfully");
  } catch (error) {
    console.error("Error update documents:", error);
    response.status(500).send("Error update Trip");
  }
});

export const createTrip = onRequest({cors: cors}, async (request, response) => {
  try {
    const newData = request.body;

    await getFirestore().collection("trip").add(newData);

    response.status(200).send("create successfully");
  } catch (error) {
    console.error("Error create documents:", error);
    response.status(500).send("Error create Trip");
  }
});

export const deleteTrip = onRequest({cors: cors}, async (request, response) => {
  try {
    const id = request.query.id as string;

    await getFirestore().collection("trip").doc(id).delete();

    response.status(200).send("delete successfully");
  } catch (error) {
    console.error("Error delete documents:", error);
    response.status(500).send("Error delete Trip");
  }
});

export const queryRecipes = onRequest({cors: cors},
  async (request, response) => {
    try {
      const querySnapshot = await getFirestore().collection("recipes").get();

      const documents: unknown[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      response.json(documents);
    } catch (error) {
      console.error("Error getting documents:", error);
      response.status(500).send("Error getting Recipes");
    }
  });

export const createRecipe = onRequest({cors: cors},
  async (request, response) => {
    try {
      const newData = request.body;

      await getFirestore().collection("recipes").add(newData);

      response.status(200).send("create successfully");
    } catch (error) {
      console.error("Error create documents:", error);
      response.status(500).send("Error create Recipe");
    }
  });
