import Payload from "payload";
import path from "path";
require("dotenv").config();

const { PAYLOADCMS_SECRET, MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your need
const collectionName = "lightCone";
const data = require("./import_files/LightCone.json");
const idField = "lightcone_id";
const siteId = "lKJ16E5IhH";
const userId = "63fec4372464d0e4c5c316e7"; // NorseFTX@gamepress.gg User ID for author field

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      mongoURL: MONGO_URL as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         getData().then(
            (result) => {
               process.exit(0);
            },
            (err) => {
               console.error(err);
               process.exit(-1);
            }
         );
      },
   });
start();

const getData = async () =>
   Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading

//Uploads an entry and custom field data; NOTE: Still need to add "check for existing entry" functionality
const seedUploads = async (result: any) => {

	const idValue = result[idField];

	// Define Image fields (global)
	const iconImport = {
		image_full: siteId + "_" + result.image_full?.name.replace(".png",""),
	}

	// Unlock Materials array
	var matData: any = [];
	var promotionCostImport: any = [];

	const allmatjson = JSON.stringify(result.promotion_cost);
	const matList = allmatjson?.split("data_key\":").map(a => a.replace(/}.*/,"")).slice(1).filter((v,i,a) => a.indexOf(v) === i);

	if (matList?.length > 0) {
		matData = await Promise.all(matList.map(async (mat:any) => {
			const findMat = await payload.find({
				collection: "materials-" + siteId,
				where: {
					data_key: {
						equals: mat.toString(),
					}
				}
			});
			if (findMat?.docs?.[0]?.id) {
				return {
					data_key: [mat.toString()],
					id: findMat?.docs?.[0]?.id,
				};
			}
			else {
				return null;
			}
		}));
	}

	if (result.promotion_cost.length > 0) {
		promotionCostImport = result.promotion_cost.map((l:any) => {
			const matQty = l.material_qty?.map((mat:any) => {
				const matId = matData.find((a:any) => a.data_key == mat.materials?.data_key)?.id;
	
				return {
					...mat,
					materials: matId,
				}
			});
	
			return {
				...l,
				material_qty: matQty,
			}
		});
	}

	var matQtyImport = {
		promotion_cost: promotionCostImport,
	}

	// ====================================
	// ====================================
	// Relation Fields
	// ====================================

	var relationFields: any = {};
	// Single relation fields
	relationFields["term_rarity"] = null;
	relationFields["term_path"] = null;

	// Multi relation fields
	// relationFields["skill_data"] = null;

	var fieldName = "term_rarity";
	var idName = "name";
	var collName = "termRarity";
	if (result[fieldName]?.[idName]) {
		const relEntry = await payload.find({
			collection: collName + "-" + siteId,
			where: {
				[idName]: {
					equals: result[fieldName]?.[idName],
				},
			}
		});

		if (relEntry?.docs?.[0]?.id) {
			relationFields[fieldName] = relEntry?.docs?.[0]?.id;
		}
	}
	var fieldName = "term_path";
	var idName = "data_key";
	var collName = "termPath";
	if (result[fieldName]?.[idName]) {
		const relEntry = await payload.find({
			collection: collName + "-" + siteId,
			where: {
				[idName]: {
					equals: result[fieldName]?.[idName],
				},
			}
		});

		if (relEntry?.docs?.[0]?.id) {
			relationFields[fieldName] = relEntry?.docs?.[0]?.id;
		}
	}

	// if (result.traces?.length > 0) {
	// 	const traceEntry = await Promise.all(result.traces.map(async (t:any) => {
	// 		const findTrace = await payload.find({
	// 			collection: "trace-" + siteId,
	// 			where: {
	// 				trace_id: {
	// 					equals: t.trace_id,
	// 				},
	// 			}
	// 		});
	// 		if (findTrace?.docs?.[0]?.id) {
	// 			return findTrace?.docs?.[0]?.id;
	// 		}
	// 		else {
	// 			return null;
	// 		}
	// }));

	// 	if (traceEntry.length > 0) {
	// 		relationFields["traces"] = traceEntry;
	// 	}
	// }

	// ====================================
	// End of Relation Fields
	// ====================================
	// ====================================


	// Check if entry exists
	const existingEntry = await payload.find({
		collection: collectionName + "-" + siteId,
		where: {
			[idField]: {
				equals: idValue,
			},
		}
	});
	
	// Update entry if exists
	if (existingEntry.docs.length > 0) {
		console.log(`Entry "${idField}: ${idValue}" already exists. Overwriting data.`);
		
		const baseID = existingEntry.docs[0].entry.id;
		const custID = existingEntry.docs[0].id;

		var baseData = {
			...result,
			collectionEntity: collectionName + "-" + siteId,
			icon: siteId + "_" + result.icon?.name.replace(".png",""),
			author: userId,
		};

		const updateItem = await payload.update({
			collection: "entries",
			id: baseID,
			data: baseData,
		});
		sleep(200);
		console.log(`${JSON.stringify(updateItem)} Entry updated!`);

		const itemId = updateItem.id;

		var custData = {
			...result,
			entry: itemId,
			id: collectionName + "-" + itemId,
			...iconImport,
			...matQtyImport,
			...relationFields,
		};

		const updateItemCustom = await payload.update({
			collection: collectionName + "-" + siteId,
			id: custID,
			data: custData,
		});
		console.log(`${JSON.stringify(updateItemCustom)} Custom Entry updated!`);
	}

	// Otherwise, create a new entry
	else {
		var baseData = {
			...result,
			collectionEntity: collectionName + "-" + siteId,
			icon: siteId + "_" + result.icon?.name.replace(".png",""),
			author: userId,
		};
	
		const createItem = await payload.create({
			collection: "entries",
			data: baseData,
		});
		//Limit speed
		sleep(200);
		console.log(`${JSON.stringify(createItem)} Import completed!`);
		
		const itemId = createItem.id;
		
		var custData = {
			...result,
			entry: itemId,
			id: collectionName + "-" + itemId,
			...iconImport,
			...matQtyImport,
			...relationFields,
		};

		const createItemCustom = await payload.create({
			collection: collectionName + "-" + siteId,
			data: custData,
		});
	   
	   	console.log(`${JSON.stringify(createItemCustom)} Custom Data Import completed!`);
	}
};

//Sleep function to limit speed, can remove if not needed
const sleep = (milliseconds: any) => {
   const start = new Date().getTime();
   for (let i = 0; i < 1e7; i += 1) {
      if (new Date().getTime() - start > milliseconds) {
         break;
      }
   }
};
