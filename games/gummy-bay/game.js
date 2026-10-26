import {chooseParcel,parcelVelocity,PARCEL_NOTES} from './parcel-handling.mjs?v=120';
import {createParcelFinish} from './parcel-finish.mjs?v=120';
import {focusScore,chooseInteraction} from './interaction-focus.mjs?v=117';
import {FLEET,activeFleet,fleetOwned,fleetRequest,createFleetModels} from './fleet.mjs?v=135';
import {wakingPose,createWorkshopTerminals,createCampsiteFire,workshopPlan} from './arrival-workplace.mjs?v=115';
import {neighborhoodPlan,createIslandShore,relocateFromInfill} from './island-neighborhoods.mjs?v=112';
import {addStreetHat} from './street-hats.mjs?v=113';
import {terrainHeight,WALKABLE_HILLS,createGrittyTerrain} from './gritty-terrain.mjs?v=111';
import {gritMaterial,createStreetWear} from './gritty-streets.mjs?v=111';
import {roundResidentAsset} from './resident-rounding.mjs?v=121';
import {EXTRA_PATROL_ROUTES,expandPoliceRoster} from './patrol-expansion.mjs?v=111';
import {dressPayphone} from './payphone-detail.mjs?v=111';
import {createAtmosphereOverhaul,coastalWeather} from './graphics-atmosphere.mjs?v=132';
import {LOT_CARS,LOT_SITE,lotCar,lotOwned,lotRequest,handlingFor,createCar,stepCar,resolveMove,setLong,chaseCamera,trunkCapacity,trunkCount,moveTrunk,seizeTrunk} from './car-physics.mjs?v=145';
import {carGeometry,createLotModels,createLot,lotLayout,lotColliders,LOT_DOOR,createSkidMarks,createEngineAudio,CAR_MATERIAL} from './car-kit.mjs?v=145';
import {CRUISER_SPEC,cruiserSpawn,createCruiser,stepCruisers,cruisersWanted,cruiserCount} from './police-cruisers.mjs?v=145';
import {rainAt,wetnessAt,weatherSky,forecast,dayWeather,weatherBudget,weatherClock} from './weather.mjs?v=145';
import {createRainFX,createRainAudio} from './weather-fx.mjs?v=145';
function gbSky(){return weatherSky(coastalWeather(s.day,s.time),s.day,s.time);}
import {createArchitectureOverhaul} from './graphics-architecture.mjs?v=110';
import {createLandscapeOverhaul} from './graphics-landscape.mjs?v=110';
import {createLifeOverhaul} from './graphics-life.mjs?v=113';
import {applyCoastalSurface} from './graphics-surfaces.mjs?v=110';
import {tentPointBlocked,tentPropBlocked,tentFootprintBlocked,tentFloorHeight,tentCeilingHeight,tentPropBands} from './tent-access.mjs?v=52';
import {furnitureFootprint,escapeFurniture,escapeEnclosure} from './furniture-access.mjs?v=49';
import {occupiedWindowLighting} from './window-lighting.mjs?v=47';
import {policeLighting} from './police-lighting.mjs?v=46';
import {rvFloorHeight,rvCeilingHeight,rvPropBands} from './rv-support.mjs?v=53';
import {townPropFloorHeight} from './town-surfaces.mjs?v=54';
import {crouchStep,dampedTravel,jumpStep,bufferedJump,playerViewHeights,firstPersonVisibility,limitPlayerJump,playerHeadFits,riseTooSteep} from './player-view.mjs?v=119';
import {readExchangeReceipt,exchangeRequest,matchExchangeReceipt,exchangeGesturePose,EXCHANGE_GESTURE_MS} from './exchange-gesture.mjs?v=43';
import {worldLighting,sunOffset,selectPracticalLights} from './world-lighting.mjs?v=122';
import {atmosphericDistancePlan} from './atmospheric-distance.mjs?v=103';
import {SCRUFFY_WELCOME_SITES,SCRUFFY_WELCOME_COLLIDERS,scruffyWelcomeProfile,scruffyWelcomeMounted,createScruffyWelcome} from './scruffy-welcome.mjs?v=126';
import {workshopEquipment,assemblyWording} from './equipment-guide.mjs?v=39';
import {drawSignText,drawSignBoard,drawStockBoard} from './signage.mjs?v=38';
import {WORKSHOP_NAMES,commitWorkshopMove,readWorkshopMove} from './workshop-move.mjs?v=135';
import {policeSight,policeFeedback,readPoliceReport} from './police-feedback.mjs?v=36';
import {physicalPointTypes,actionPointTypes,actionPointMatches,pointApproach} from './point-access.mjs?v=116-35';
import {exchangeAccess,freshExchangePose} from './exchange-access.mjs?v=34';
import {vehicleDoorAccess} from './vehicle-access.mjs?v=33';
import {drivingSurfaceZone,limitVehicleZoneSpeed,roadZoneLine,VEHICLE_ROADS,PEDESTRIAN_WAYS} from './road-zones.mjs?v=68';
import {PARKING_BAYS,parkingGuide,parkingSnapPose,parkingGuideLine} from './parking-guide.mjs?v=69';
import {DISTRICT_BUILDING_SITES,DISTRICT_CONTRAST_COLLIDERS,districtArchitectureProfile,districtGeometricContrast,createDistrictArchitecture} from './district-architecture.mjs?v=126';
import {createStreetConstruction} from './street-construction.mjs?v=126';
import {createStarterStreet} from './starter-street.mjs?v=126';
import {openingCamera,openingDoorstep,insideRvShell} from './opening-shot.mjs?v=122';
import {createCineOverlay,playWhoosh,playPhoneRing,blendPose} from './cinematics.mjs?v=132';
import {FLYOVER_MINUTES,flyoverAt} from './loading-flyover.mjs?v=132';
import {hintAt} from './hints.mjs?v=132';
import {createSkyClouds} from './sky-clouds.mjs?v=146';
import {ACT1_DURATION,act1At,act1PanelHtml,doorstepEyePose} from './story-act1.mjs?v=132';
import {STORY_VERSION,ACTS,QUESTS,CUT_IDS,CUTS,CUT_ANCHORS,normalizeStory,stepStory,markSeen,currentQuest,questProgress,currentAct,raidDue,applyRaid,recordRaid,createStashGame,cutTimeline,storyCutAt,storyCardHtml,storyHold} from './story-acts.mjs?v=144';
import {DEALER_ROSTER,RUNNER_ROSTER,CREW,freshEmpire,normalizeEmpire,advanceEmpire,recruitDealer,assignCustomer,unassignCustomer,restockDealer,collectDealer,districtCustomers,dealerOf,runnerOf,stockTotal,hireCrew,crewSlots,slotUpgradeCost,buySlot,fireCrew,hireRunner,dispatchRunner,dealerLow,dealerForecast} from './dealer-network.mjs?v=143';
import {VERTICAL_TOWN_LAYER,VERTICAL_TOWN_BARRIERS,verticalTownFloorHeight,createVerticalTownLayer} from './vertical-town.mjs?v=126';
import {STREET_PROP_PROFILES,STREET_PROP_COLLIDERS,createContextualStreetProps} from './contextual-street-props.mjs?v=126';
import {propReachable,stepProp,resolvePropPairs,propThrowSpin,propVisualLift,PROP_RADIUS,PROP_HALF_WIDTH,PROP_HALF_DEPTH} from './prop-motion.mjs?v=120';
import {createFixedStepper} from './sim-clock.mjs?v=122';
import {readQaFlag,qaStorageKey,createDayDirector,steerHold} from './qa-harness.mjs?v=140';
import {createWalkGrid} from './walk-grid.mjs?v=140';
import {startFx,fxFrame,fxLine,chooseReaction,reactionLine,reactionPose,crowdFriendly,idleBeat,customerFeedback,customerDislike,REACT_SECONDS,REACT_RANGE} from './npc-fx.mjs?v=142';
import {createNpcFxLayer,NPC_BUBBLE_CSS} from './npc-fx-layer.mjs?v=142';
import {normalizeStaffRole,remoteWorkerStatus,staffAssignment,workerAdvice} from './staff-status.mjs?v=123';
import {TentGardener,StreetSeller} from './field-crew.mjs?v=135';
import {customerBrief,customerReply,readCustomerReceipt,sampleChoices,customerVoice} from './customer-context.mjs?v=30';
import {normalizeCravings,noteSale,cravingBudgetBonus,cravingAsk,markAsked,cravingState} from './customer-craving.mjs?v=124';
import {bindGameplayState,emitGameplay,subscribeGameplay} from './gameplay-feed.mjs?v=125';
import {grantStarter,starterOfferDue,STARTER_TEXT,STARTER_NPC,STARTER_PRODUCT,STARTER_QTY,STARTER_PRICE} from './starter-sale.mjs?v=125';
import {policeNotice} from './police-notice.mjs?v=125';
import {firstSaleProtected,normalizeSquadSave} from './sale-shield.mjs?v=132';
import {inVision} from './police-vision.mjs?v=132';
import {freshChase,spotChase,stepChase,escalateChase,stageSeconds} from './police-ladder.mjs?v=132';
import {hideSpotAt,hidingClears} from './hide-spots.mjs?v=132';
import {stepWitness} from './witness-call.mjs?v=132';
import {trySlip,spareStack,slipZoneOpen,SLIP_ZONES} from './pocket-slip.mjs?v=132';
import {bonk,scuffleWeapon,shopWeapons,freshTarget,COP_HEAT} from './scuffle.mjs?v=132';
import {donutBribe,cashBribe,DONUT_PRICE} from './sugar-bribe.mjs?v=132';
import {applyBust,bustedTimeline,bustedSample,paintMugshot} from './busted.mjs?v=132';
import {searchPenalty,penaltyMessage,penaltyTier} from './police-penalty.mjs?v=135';
import {levelOf,levelProgress} from './xp-curve.mjs?v=135';
import {gateButtons} from './reach-gate.mjs?v=135';
import {createSquadCast,SQUAD_SHOP,SQUAD_PAN} from './squad-cast.mjs?v=146';
import {BASE_EFFECTS,benchIngredient,mixResult,mixExperience} from './mix-bench.mjs?v=125';
import {recipeName,effectById} from './mix-core.mjs';
import {PANTRY,mixedStrainIndex,mixedSlots} from './mix-pantry.mjs?v=130';
import {createCityExpansion,CITY_ROADS,OVERPASS} from './city-expansion.mjs?v=137';
import {readabilityGrade,streetLampSpots,treeSpots,dressingSpots,createStreetDressing} from './light-grade.mjs?v=139';
import {normalizeArcade,gripColor,ownedPosters,prizeById} from './arcade-core.mjs?v=137';
import {createArcadeUI,POSTER_ART} from './arcade-ui.mjs?v=137';
import {CITY_SHELLS} from './city-shells.mjs?v=133';
import {createStaticBatcher} from './static-batch.mjs?v=139';
import {recipeOutcome,mixedPrice,stirOutcome,stirBucket,stirLabel,saleConsequences,revealSummary,newMixSeed,isBad,riskBonus,resolvedAdds} from './mix-risk.mjs?v=130';
import {stationReadiness} from './station-readiness.mjs?v=28';
import {stockDisplay} from './stock-display.mjs?v=28';
import {gestureCredit,sealPosition,sealReady,taskInstruction,workSurfaceMotion} from './tactile-work.mjs?v=27';
import {createBenchSession,BENCH_KIND,ensureCraftQuality,growQuality,hasGrowScore,blendQuality,packScore,listedQuality,complaintHits,playBenchCue} from './bench-mode.mjs?v=134';
import {residentPlan,residentDescription,citizenRouteSteps,citizenRoute,segmentClear,curfewActive} from './resident-life.mjs?v=125';
import {residentLocomotionClip,residentActionRate,applyResidentTransition} from './resident-animation.mjs?v=109';
import {deliveryRound} from './delivery-round.mjs?v=1';
import {PHONE_SCREENS,phoneDeviceStatus} from './phone-device.mjs?v=1';
import {PHONE_APP_KEYS,PHONE_HOME_APPS,buildContactBook,contactBookHTML,satisfactionContext,satisfactionView,satisfactionHTML} from './phone-contacts.mjs?v=123';
import {weekdayClock,compassView,policeBanner,phoneBadges,curfewCue,revealTownPlaces} from './hud-readout.mjs?v=132';
import {s1Clock,HUD_ICONS,HOTBAR_SLOTS,hotbarSlot,hotbarCounts,hotbarHTML,pushNotice,noticeKind,sleepSummary,sleepCardHTML,APP_ICONS} from './hud-s1.mjs?v=135';
import {riderLook,BOARDS,boardById,normalizeSkate,buyBoard,createRide,stepRide,rideCamera,skateFov,DECK_HEIGHT,BAIL_TIME,KICKFLIP_SITE,KICKFLIP_POINT,KICKFLIP_COLLIDERS,skateSpotHeight,createBoardModel,spinBoardWheels,createRider,updateRider,createSkateAudio,createKickflipContainer,createKickflipKeeper,updateKickflipKeeper,kickflipShopHTML} from './skateboard.mjs?v=146';
import {SHOP_PANELS,armShopMarkup,shopConfirmHTML,shopRefundHTML} from './shop-counter.mjs?v=123';
import {buildInbox,inboxHTML,negotiationView,dealBubbleHTML,counterSheetHTML,acceptChance,contactGraphModel,contactGraphHTML,productRowsHTML} from './phone-apps.mjs?v=123';
import {createCoastalBackdrop} from './coastal-backdrop.mjs?v=25';
import {HORIZON_TREE_SITES,horizonSiteOutsideBounds,horizonViewGap,createDistrictHorizon} from './district-horizon.mjs?v=126';
import {SKYLINE_LANDMARK_SITES,SKYLINE_APPROACHES,skylineFootprintOnSupport,createTownSkyline} from './town-skyline.mjs?v=126';
import {TOWN_UTILITY_SITES,TOWN_UTILITY_KINDS,utilityInsideSupport,createTownUtilities} from './town-utilities.mjs?v=126';
import {OVERHEAD_INFRASTRUCTURE_SITES,OVERHEAD_INFRASTRUCTURE_PROFILES,roofSupportsContain,overheadCableSegments,createOverheadInfrastructure} from './overhead-infrastructure.mjs?v=126';
import {TOWN_FENCE_PROFILES,TOWN_FENCE_COLLIDERS,fencePointBlocked,fenceGateClear,createTownFencing} from './town-fencing.mjs?v=126';
import {FOREGROUND_DEPTH_PROFILES,FOREGROUND_DEPTH_COLLIDERS,foregroundPointBlocked,foregroundSightlineClear,createForegroundDepth} from './foreground-depth.mjs?v=126';
import {DOMESTIC_WORKPLACE_PROFILES,DOMESTIC_WORKPLACE_COLLIDERS,EQUIPMENT_REPETITION_SLOTS,domesticPanelInsideHome,equipmentRepetitionState,createDomesticWorkplace} from './domestic-workplace.mjs?v=126';
import {DOORWAY_REVEAL_SITES,DOORWAY_REVEAL_PROFILES,DOORWAY_REVEAL_COLLIDERS,doorwayRevealCollisionAligned,doorwayRevealPathClear,createDoorwayReveals} from './doorway-reveals.mjs?v=126';
import {townGapColliders} from './town-collision.mjs?v=122';
import {wishAxes,groundSpeed,moveResponse,capAirWish,verticalGravity,cutJump,clampFall,cliffDrop,slopePush,staminaStep,coyoteLeft,landingDip,decayDip,headBob,slideMotion,groundSupport,canJumpNow,LOOK_SENSITIVITY,PITCH_LIMIT,FOV_BASE,FOV_RESPONSE,JUMP_LAUNCH,SNAP_DISTANCE,BOB_AMOUNT,SPRINT_SPEED,stepEyeOffset,steerStep,driveYawRate,driveFov} from './player-controller.mjs?v=144';
import {colliderCandidates} from './spatial-hash.mjs?v=122';
import {nearestOpenPoint} from './spawn-safety.mjs?v=122';
import {WINDOW_CONNECTION_PROFILES,WINDOW_CONNECTION_COLLIDERS,windowApertureSamples,windowConnectionAligned,createWindowConnections} from './window-connections.mjs?v=126';
import {ORDINARY_UNUSUAL_PROFILES,ORDINARY_UNUSUAL_COLLIDERS,ordinaryUnusualInsideHome,ordinaryUnusualPairing,createOrdinaryUnusualWork} from './ordinary-unusual-work.mjs?v=126';
import {PUBLIC_SERVICE_PROFILES,PUBLIC_SERVICE_COLLIDERS,publicServiceOpposed,publicServiceMounted,createPublicServiceFronts} from './public-service-fronts.mjs?v=126';
import {NARROW_ALLEY_PROFILES,NARROW_ALLEY_COLLIDERS,narrowAlleyPathSamples,narrowAlleyPathClear,createNarrowAlleys} from './narrow-alleys.mjs?v=126';
import {JUNCTION_REVEAL_PROFILES,JUNCTION_REVEAL_COLLIDERS,junctionRevealReading,nearestJunctionReveal,createJunctionReveals} from './junction-reveals.mjs?v=126';
import {NIGHT_OBSTACLE_PROFILES,NIGHT_SILHOUETTE_COLLIDERS,nightSilhouettePlan,nightObstacleProfile,createNightSilhouettes} from './night-silhouettes.mjs?v=142';
import {SHOP_APPROACH_PROFILES,SHOP_APPROACH_COLLIDERS,shopApproachPointBlocked,shopApproachSightlineClear,createShopApproaches} from './shop-approaches.mjs?v=126';
import {PRODUCTION_CONTAINER_PROFILES,PRODUCTION_CONTAINER_COLLIDERS,productionContainersOnTable,createProductionContainers} from './production-containers.mjs?v=126';
import {OCCUPATIONAL_OUTFIT_PROFILES,OCCUPATIONAL_OUTFIT_COLLIDERS,occupationOutfitParts,selectOccupationalActors,createOccupationalOutfits} from './occupational-outfits.mjs?v=126';
import {RESIDENT_ACCESSORY_PROFILES,RESIDENT_ACCESSORY_COLLIDERS,RESIDENT_HAIRSTYLE_PROFILES,RESIDENT_HAIRSTYLE_COLLIDERS,residentAccessoryParts,selectResidentAccessories,createResidentAccessories,createResidentHairstyleRig,residentHairstyleResources} from './resident-accessories.mjs?v=126';
import {RESIDENT_EXPRESSION_COLLIDERS,RESIDENT_FACE_FOCUS_BOUNDS,residentExpressionState,applyResidentBlinkMorph,createResidentExpressionRig,updateResidentExpressionRig,residentExpressionResources} from './resident-expressions.mjs?v=121';
import {createChunkyCast,concealSculptedResident,createChunkyPlayerHand,updateChunkyPlayerHand} from './chunky-cast.mjs?v=146';
import {STREET_CROWD_COLLIDERS,STREET_CROWD_FAR,STREET_CROWD_SIZE,createStreetCrowd,crowdRoute} from './street-crowd.mjs?v=146';
import {RESIDENT_PROPORTION_COLLIDERS,RESIDENT_PROPORTION_PROFILES,residentProportionProfile,createResidentProportionRig,applyResidentProportionRig,createResidentFootSilhouettes} from './resident-proportions.mjs?v=126';
import {RESIDENT_CLOTHING_COLLIDERS,RESIDENT_CLOTHING_PROFILES,RESIDENT_FABRIC_PATTERN,residentClothingProfile,clothingTone,residentFabricTexture,createResidentClothing} from './resident-clothing.mjs?v=108';
import {LOGICAL_WEAR_COLLIDERS,LOGICAL_WEAR_MARKS,logicalWearMarkValid,logicalWearCoversPoint,logicalWearMarks,createLogicalWear} from './logical-wear.mjs?v=126';
import {OBJECT_SILHOUETTE_COLLIDERS,OBJECT_SILHOUETTE_PROFILES,objectSilhouetteProfile,objectSilhouetteBounds,attachObjectSilhouette,setObjectSilhouetteQuality} from './object-silhouettes.mjs?v=93';
import {turnTowards,sweepWalk,stockSummary,workerPoseValid,createBalanceFeedback,TRAVEL_DISTRICTS,TRAVEL_LANDMARKS,nearestTravelPoint,travelReading,travelMapScale,formatTravelDistance,projectMapMarker,projectMapPoint,mapRectVisible,travelMapCaption,projectTrackedCustomer} from './town-experience.mjs?v=60';
import {StockroomCrafter,validCargo,findRoute,createAccessAudit} from './workshop-logistics.mjs?v=29';
import {stationStatus as workshopStageStatus} from './presentation.mjs?v=25';
import {productionPlan,commitProduction,validateSave,backupSlot} from './business-core.mjs?v=130';
import {locationKeyForType,locationMemoryCopy,normalizeLocationVisits,recordLocationVisit} from './location-memory.mjs?v=61';
import {journeyProgress,journeySummary} from './journey-progress.mjs?v=62';
import {acceptCoopPing,coopPingStatus} from './coop-ping.mjs?v=63';
import {acceptCoopActivity,activitySnapshot,appendCoopActivity,coopActivityLine,deriveCoopActivity} from './coop-activity.mjs?v=64';
import {businessPortrait,progressionSummary} from './progression-portrait.mjs?v=65';
import {createVisualPolish} from './visual-polish.mjs?v=113';
import {createTownAudio,footstepSurface,replaceAudioMixer,readAudioLevels,AUDIO_STORAGE_KEY,cueForAction,cueForGameplay,stationCue,isManualAction} from './audio.mjs?v=124';
import * as THREE from './vendor/three.module.min.js';
import {GLTFLoader} from './vendor/gltf-loader.js';
import {taskFraction,restoreComfort} from './workshop-state.mjs?v=25';
import {createEffects,lookPreset,detectLookQuality} from './post-stack.mjs?v=122';
const WORLD={minX:-280,maxX:280,minZ:95-(178*171*10/560),maxZ:95};
const $=id=>document.getElementById(id),canvas=$('view');
const STRAINS=[{name:'Pine Pop',desc:'The original green gummy.',color:0x93c35b,seed:30,price:30,level:1,time:24},{name:'Lemon Fizz',desc:'Sunny, tangy yellow chews.',color:0xe2ca63,seed:35,price:42,level:2,time:29},{name:'Purple Cloud',desc:'Soft violet gummy clusters.',color:0xaa83ce,seed:40,price:56,level:3,time:35},{name:'Blueberry Bounce',desc:'Rare blue, big flavour.',color:0x75bdd2,seed:45,price:72,level:4,time:40},{name:'Frostbite',desc:'Premium minty clusters.',color:0xb8e4d4,seed:74,price:92,level:5,time:46},{name:'Sunset Gold',desc:'The coast’s most prized gummy.',color:0xe5a86e,seed:100,price:118,level:7,time:50}];
const BASE_COUNT=6;
const INGREDIENTS=PANTRY.map(f=>({name:f.name,effect:f.adds,cost:f.price,color:f.color,mixId:f.id,unlockLevel:f.unlockLevel,tag:f.tag,blurb:f.blurb}));
function BENCH_INGREDIENTS(){return [0,1,2,3].map(i=>{const f=benchIngredient(i);return {name:f.name,effect:f.effect,cost:f.cost,color:f.color,mixId:f.mixId};});}
STRAINS.forEach((p,i)=>{if(i<BASE_COUNT)p.effects=BASE_EFFECTS[i].slice();});
// Mixed strains keep a stable index per (base, ingredient); applyMixSeed rewrites their effects per save.
let appliedMixSeed=null;
function mixedStrainEntry(base,ingredient,seed){const p=STRAINS[base],f=INGREDIENTS[ingredient],item=PANTRY[ingredient],out=recipeOutcome(seed,p.effects,item),name=recipeName(out.effects)+' '+p.name;return {...p,name,desc:p.name+' mixed with '+f.name.toLowerCase()+'.',price:mixedPrice(p.price,p.effects,out.effects),color:new THREE.Color(p.color).lerp(new THREE.Color(f.color),.5).getHex(),mixed:true,base,ingredient,effects:out.effects,recipe:recipeName(out.effects),recipeKey:out.key,twist:out.twist,adds:out.adds,autoName:name};}
for(const slot of mixedSlots(BASE_COUNT,INGREDIENTS.length))STRAINS[slot.index]=mixedStrainEntry(slot.base,slot.ingredient,0);
function applyMixSeed(seed,names){for(const slot of mixedSlots(BASE_COUNT,INGREDIENTS.length)){const entry=mixedStrainEntry(slot.base,slot.ingredient,seed),custom=names?.[slot.index];if(typeof custom==='string'&&custom.trim())entry.name=custom.trim().slice(0,40);Object.assign(STRAINS[slot.index],entry);}appliedMixSeed=seed;}
function normalize(v){for(let k of ['seeds','raw','gummies','packs'])while(v[k].length<STRAINS.length)v[k].push(0);v.layout??={};v.storedPacks??=STRAINS.map(()=>0);while(v.storedPacks.length<STRAINS.length)v.storedPacks.push(0);v.workerEnabled??={gardener:true,crafter:true,seller:true};v.vehicleOwned??=false;v.vehiclePark??={x:-180,z:-155,angle:0};v.npcs??=[];v.packStation??=!!v.room;v.trimmers??=!!v.harvested;v.relations??={};v.atmWeek??=0;v.atmUsed??=0;v.ingredients??=INGREDIENTS.map(()=>0);v.mixer??=false;v.mixed??=0;v.payment??='cash';v.trash??=0;v.trashEarned??=0;v.picked??={};v.ledger??=[];v.visits=normalizeLocationVisits(v.visits);return v;}
const CONTACTS=[{name:'Jules',x:-7,z:21,color:0xc67562,skin:0xc68d6a,budget:1.12,line:'Working the late shift again. Could use something sweet.'},{name:'Benji',x:18,z:8,color:0x80a7a8,skin:0xd8b991,budget:.98,line:'I’m on a budget, but I’ll come back if it’s good.'},{name:'Nina',x:-22,z:-9,color:0xb9a567,skin:0xb27e5b,budget:1.2,line:'Good flavour, fair price. That’s all I ask.'},{name:'Oz',x:38,z:-17,color:0x9e87b4,skin:0xe1b28f,budget:1.3,line:'I’ll pay more for premium stuff. Don’t disappoint me.'},{name:'Frankie',x:12,z:40,color:0x7f9f63,skin:0xc49674,budget:1.08,line:'Got a long walk home. Meet me by the pier.'}];
const fresh=mode=>({version:3,mode,cash:400,bank:0,x:-52.6,z:28.2,yaw:-Math.PI/2,pitch:0,day:1,time:540,xp:0,heat:0,called:0,chapter:0,room:false,layout:{},storedPacks:STRAINS.map(()=>0),workerEnabled:{gardener:true,crafter:true,seller:true},vehicleOwned:false,vehiclePark:{x:-180,z:-155,angle:0},npcs:[],props:null,packStation:false,trimmers:false,relations:{},visits:{},cravings:{},atmWeek:0,atmUsed:0,tents:0,soil:0,seeds:STRAINS.map(()=>0),raw:STRAINS.map(()=>0),gummies:STRAINS.map(()=>0),packs:STRAINS.map(()=>0),ingredients:INGREDIENTS.map(()=>0),mixer:false,mixed:0,payment:'cash',trash:0,trashEarned:0,picked:{},ledger:[],wrappers:0,can:false,water:0,plants:[],lights:0,irrigation:false,bench:0,house:0,helpers:{gardener:false,crafter:false,seller:false},staffConfig:{gardener:{strain:-1,tent:-1,stock:'carried',route:'walk'},crafter:{strain:-1,tent:-1,stock:'stored',route:'timer'},seller:{strain:-1,tent:-1,stock:'carried',route:'walk'}},hired:0,planted:0,watered:0,harvested:0,made:0,listed:0,texted:0,sold:0,earned:0,listing:null,threads:{},deals:[],laundry:null,laundered:0,front:false,job:null,savedAt:Date.now()});
let s=fresh('story'),mode='story',slot=1,active=false,panel='title',keys={},yaw=0,pitch=0,near=null,conversationPoint=null,track=null,stamina=100,now=0,last=0,uiTimer=0,saveTimer=0,walkPhase=0,walk=false,toastTimer=0,selected=0,phoneTab='messages',processingRemote=false,work=null,pendingReset=null;
bindGameplayState(()=>({day:s.day,time:s.time,heat:s.heat,curfew:curfewActive(s.time),police:policeNotice(s.heat,curfewActive(s.time)),cravings:CONTACTS.map((_,i)=>cravingState(s.cravings?.[i],s.day))}));
const player=new THREE.Vector3(s.x,1.72,s.z),camera=new THREE.PerspectiveCamera(FOV_BASE,innerWidth/innerHeight,.08,330);camera.rotation.order='YXZ';
let renderer;try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'})}catch(e){$('modal').innerHTML='<h2>3D graphics are unavailable</h2><p>Enable hardware acceleration in your desktop browser, then reload.</p>';throw e}renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.AgXToneMapping;renderer.toneMappingExposure=.93;
// Cinematic presentation state (loading flyover, cutscenes). Read-only, never saved.
// While lit, every lighting reader uses the cinematic clock instead of the save clock.
const cineZenith=new THREE.Color(0x5b93d2);
const cine={lit:false,grade:false,pose:null,minutes:FLYOVER_MINUTES,flyover:false,loading:false,t:0,last:0,seek:null,progress:0,townBytes:0,items:0,readyAt:0,shot:-1,hint:-1,hintOffset:0};
function sceneLighting(time,isActive){return cine.lit?worldLighting(cine.minutes,true):worldLighting(time,isActive);}
const scene=new THREE.Scene();scene.background=new THREE.Color(0xb2d7df);scene.fog=new THREE.Fog(0xb2d7df,105,280);const hemi=new THREE.HemisphereLight(0xc6d5e2,0x71664d,1.15);scene.add(hemi);const sun=new THREE.DirectionalLight(0xffe2bb,3.1);sun.position.set(-38,65,45);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-37,right:37,top:37,bottom:-37,near:1,far:180});sun.shadow.normalBias=.025;sun.shadow.bias=-.0001;sun.shadow.radius=2;scene.add(sun);
const furnishings=[],colliders=[],points=[],people=[],plantVisuals=[],tents=[],lights=[],materials=new Map(),geometry=new Map();
function addFurnishing(kind,x,z,width,depth,home){const b=furnitureFootprint(kind,x,z,width,depth,home);furnishings.push(b);colliders.push(b);}
function furnitureLayoutConflict(b){return !!(b.furniture&&active&&s.room&&s.house===b.home&&(s.installed||[]).some(i=>{const p=s.layout?.[b.home+':'+i];return Number.isInteger(i)&&i>=0&&i<maxTents()&&p?.home===b.home&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.abs(p.x-b.x)<(b.w-.65)/2+1.2&&Math.abs(p.z-b.z)<(b.d-.65)/2+1.2;}));}
function colliderEnabled(b){return (b.furniture!=='mixer'||active&&s.room&&s.mixer&&s.house===b.home)&&!furnitureLayoutConflict(b);}
function mat(c,extra={}){const key=c+JSON.stringify(extra);if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color:c,roughness:.84,...extra}));return materials.get(key)}
function box(x,y,z,w,h,d,c,solid=false,parent=scene){let key=`${w},${h},${d}`;if(!geometry.has(key))geometry.set(key,new THREE.BoxGeometry(w,h,d));let o=new THREE.Mesh(geometry.get(key),mat(c));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);if(solid)colliders.push({x,z,w:w+.65,d:d+.65});return o}
function sphere(x,y,z,r,c,parent=scene,sx=1,sy=1,sz=1){let o=new THREE.Mesh(new THREE.SphereGeometry(r,12,9),mat(c));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function cyl(x,y,z,r,h,c,parent=scene,sides=12,r2=r){let o=new THREE.Mesh(new THREE.CylinderGeometry(r2,r,h,sides),mat(c));o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o}
function rounded(x,y,z,w,h,d,c,parent=scene){let r=Math.min(.12,w*.2,h*.2,d*.2),shape=new THREE.Shape(),a=-w/2,b=-h/2;shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);let g=new THREE.ExtrudeGeometry(shape,{depth:d-r*2,bevelEnabled:true,bevelThickness:r,bevelSize:r*.4,bevelSegments:2,steps:1,curveSegments:3});g.translate(0,0,-d/2+r);let o=new THREE.Mesh(g,mat(c));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
// Static lettering is immutable and shared; stock boards explicitly own their map.
const signMaterials=new Map(),signPlane=new THREE.PlaneGeometry(1,.25);
// v143: free-standing double-sided signs read mirrored from behind ("SROTOM ROBRAH"). Back faces sample the map flipped.
function readableBothSides(material){material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#ifdef USE_MAP\n\tvec2 signUv = gl_FrontFacing ? vMapUv : vec2( 1.0 - vMapUv.x, vMapUv.y );\n\tdiffuseColor *= texture2D( map, signUv );\n#endif');};material.customProgramCacheKey=()=>'sign-readable-back';material.userData.readableBack=true;return material;}
function sign(txt,x,y,z,w=5,bg='#425f4e',fg='#fff1ca',rotation=0,{dynamic=false}={}){
 if(!dynamic)w=Math.min(w,w>=4?6.2:w);
 const key=JSON.stringify([txt,bg,fg]);let resource=dynamic?null:signMaterials.get(key);
 if(!resource){const c=document.createElement('canvas');c.width=1024;c.height=256;
  const layout=drawSignBoard(c.getContext('2d'),txt,bg,fg),tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  resource={layout,material:readableBothSides(new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide,toneMapped:false}))};
  // Do not dispose an in-use map on overflow; only the lookup is capped.
  if(!dynamic&&signMaterials.size<128)signMaterials.set(key,resource);
 }
 const o=new THREE.Mesh(signPlane,resource.material);o.scale.set(w,dynamic?w:w*.55,1);o.position.set(x,y,z);o.rotation.y=rotation;
 o.userData.signText=txt;o.userData.signLayout=resource.layout;o.userData.dynamicSign=dynamic;scene.add(o);return o;
}
function addPoint(type,label,x,z,data={}){let p={type,label,x,z,...data};points.push(p);return p}
const avatars=[];let avatarSerial=0;
function bobble(x,z,color,skin=0xd5af88,hair=0x65503e,scale=1){
const id=avatarSerial++,g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);
const torso=new THREE.Mesh(new THREE.CylinderGeometry(.27,.23,.65,8),mat(color));torso.scale.z=.67;torso.position.y=.96;torso.castShadow=true;g.add(torso);
rounded(0,.61,0,.45,.17,.32,0x4c5656,g);box(0,.66,.178,.48,.045,.035,0x464c45,false,g);rounded(0,.66,.2,.07,.065,.03,0xb9b49c,g);
const legs=[];for(let side of [-1,1]){let leg=new THREE.Group();leg.position.set(side*.145,.6,0);g.add(leg);legs.push(leg);cyl(0,-.24,0,.1,.48,0x53605f,leg);rounded(0,-.505,.075,.22,.16,.37,0x494c44,leg);rounded(0,-.56,.075,.225,.045,.38,0xc0bdad,leg);box(0,-.45,.18,.13,.018,.04,0xb8bca5,false,leg);}
const left=new THREE.Group(),right=new THREE.Group();left.position.set(-.29,1.18,0);right.position.set(.29,1.18,0);g.add(left,right);for(let [arm,side] of [[left,-1],[right,1]]){let sleeve=cyl(side*.04,-.18,0,.11,.37,color,arm);sleeve.rotation.z=side*.12;cyl(side*.07,-.4,.015,.073,.23,skin,arm);sphere(side*.08,-.55,.02,.09,skin,arm,.9,1.15,.7)}
// A large shaped head, small features, and a proper neck make the bobble-head silhouette readable.
cyl(0,1.33,0,.085,.2,skin,g);const head=new THREE.Group();head.position.y=1.8;g.add(head);
sphere(0,.02,-.015,.45,skin,head,.96,1.08,.85);sphere(0,-.23,.025,.31,skin,head,1,.79,.94);sphere(-.421,.02,0,.1,skin,head,.55,1.12,.8);sphere(.421,.02,0,.1,skin,head,.55,1.12,.8);
const eyeGroup=new THREE.Group();eyeGroup.position.y=.04;head.add(eyeGroup);for(let side of [-1,1]){sphere(side*.158,0,.365,.083,0xecebd8,eyeGroup,.86,.73,.42);sphere(side*.158,-.004,.395,.036,0x34433a,eyeGroup,.75,1,.35);sphere(side*.148,.01,.405,.012,0xf8f7e6,eyeGroup,1,1,.3);let brow=rounded(side*.155,.16,.365,.18,.036,.037,hair,head);brow.rotation.z=-side*.09;}
sphere(0,-.06,.387,.102,skin,head,.85,.77,1.2);rounded(0,-.23,.298,.19,.024,.04,0x825c48,head);sphere(0,-.18,.3,.13,skin,head,1,.35,.5);
const style=id%5;if(style===0){sphere(0,.34,-.055,.43,hair,head,1,.49,.9);for(let j=0;j<4;j++)sphere(-.23+j*.15,.38,-.03,.14,hair,head,1,.8,1);}
if(style===1){sphere(0,.32,-.08,.43,hair,head,1,.48,.95);rounded(0,.4,-.025,.75,.15,.65,0x6c7f62,head);rounded(0,.32,.33,.58,.06,.35,0x5a6f52,head);}
if(style===2){sphere(0,.3,-.1,.43,hair,head,1,.5,.9);for(let side of [-1,1]){sphere(side*.34,-.03,-.15,.21,hair,head,.65,1.65,1);sphere(side*.31,-.3,-.13,.17,hair,head,.8,.8,.9);}}
if(style===3){sphere(0,.29,-.11,.43,hair,head,1,.5,.9);for(let j=0;j<3;j++){let tuft=sphere(-.16+j*.14,.4,-.06,.17,hair,head,.8,1.3,.9);tuft.rotation.z=-.45;}}
if(style===4){sphere(0,.27,-.1,.43,hair,head,1,.5,.93);sphere(0,-.24,.18,.25,hair,head,1,.45,.62);rounded(0,-.22,.315,.14,.025,.035,0x6d5042,head);}
if(id%4===0){for(let side of [-1,1]){let frame=new THREE.Mesh(new THREE.TorusGeometry(.11,.014,5,12),mat(0x484d44));frame.scale.y=.8;frame.position.set(side*.158,.035,.413);head.add(frame)}box(0,.05,.42,.09,.018,.02,0x484d44,false,head);}
if(id%3===0){rounded(0,.98,.197,.32,.42,.03,0x73876d,g);box(0,1.18,.21,.32,.025,.02,0xb6b99e,false,g)}else{rounded(-.11,1.08,.184,.15,.13,.025,new THREE.Color(color).multiplyScalar(.83).getHex(),g);box(0,.97,.18,.018,.55,.02,0xb8b9a0,false,g);}
g.userData={head,left,right,torso,eyes:eyeGroup,id,legs,palette:{color,skin,hair}};avatars.push(g);return g;
}
function tree(x,z,size=1){
 // Shared low-poly foliage geometry; asymmetric coastal crowns, existing trunk collision.
 cyl(x,1.4*size,z,.17*size,2.8*size,0x80694e);
 if(!geometry.has('coastal-crown'))geometry.set('coastal-crown',new THREE.IcosahedronGeometry(1,1));
 const phase=Math.abs(x*.71+z*.37);
 for(let i=0;i<5;i++){
  const angle=i*2.4+phase,dx=Math.sin(angle)*.8*size,dz=Math.cos(angle)*.65*size;
  if(i<3){const branch=cyl(x+dx*.4,2.2*size,z+dz*.4,.07*size,1.25*size,0x80694e);branch.rotation.z=-dx*.55;branch.rotation.x=dz*.55;}
  const crown=new THREE.Mesh(geometry.get('coastal-crown'),mat([0x6f8f65,0x819e6e,0x587a60][i%3]));
  crown.position.set(x+dx,(3.1+(i%3)*.38)*size,z+dz);crown.scale.set((1.25+i%2*.18)*size,(.85+i%3*.12)*size,1.1*size);crown.rotation.y=angle;crown.castShadow=true;crown.receiveShadow=true;scene.add(crown);
 }
 colliders.push({x,z,w:.8,d:.8});
}
const facadeWindows=[],interiorFittings=[];
function room(x,z,w,d,name,color,roofColor=0xc18466){const front=z+d/2,paneY=1.8,paneH=1.35,paneBottom=paneY-paneH/2,paneTop=paneY+paneH/2;box(x,-.04,z,w,.12,d,0xd5c6a7);box(x-w/2,1.75,z,.25,3.5,d,color,true);box(x+w/2,1.75,z,.25,3.5,d,color,true);box(x,1.75,z-d/2,w,3.5,.25,color,true);for(const side of [-1,1]){const cx=x+side*w*.35,segmentW=w*.3,paneW=w*.18,pierW=(segmentW-paneW)/2;box(cx-(paneW+pierW)/2,1.75,front,pierW,3.5,.25,color);box(cx+(paneW+pierW)/2,1.75,front,pierW,3.5,.25,color);box(cx,paneBottom/2,front,paneW,paneBottom,.25,color);box(cx,(paneTop+3.5)/2,front,paneW,3.5-paneTop,.25,color);colliders.push({x:cx,z:front,w:segmentW+.65,d:.9});}box(x,3.65,z,w+.8,.35,d+.8,roofColor);box(x,3.95,z-d*.2,w*.65,.25,d*.7,roofColor);box(x,3.05,front+.16,Math.min(6.4,w*.45),.48,.07,0x3c4942);sign(name,x,3.05,front+.27,Math.min(3.6,w*.3),'#444b42','#c9c5ae');for(let side of [-1,1]){let pane=rounded(x+side*w*.35,paneY,front+.15,w*.18,paneH,.08,0x80b7bd);facadeWindows.push({mesh:pane,x,z,w,d,side});box(x+side*w*.35,paneY,front+.23,.055,paneH,.03,0xf5e6c6);box(x+side*w*.35,paneY,front+.23,w*.18,.055,.03,0xf5e6c6);box(x+side*w*.35,1.05,front+.35,w*.21,.25,.6,0xb88e6c);if(x<0&&z>0)for(let i=0;i<2;i++)sphere(x+side*w*.35+(i-.5)*.42,1.3,front+.34,.18,0x647951)}// striped awning
for(let i=0;i<10;i++)box(x-w*.25+i*w*.05,2.6,z+d/2+.9,w*.05,.08,1.6,i%2?0xe8d9b8:roofColor);box(x,2.4,z+d/2+1.65,w*.5,.25,.1,roofColor);return{x,z,w,d}}
function counter(x,z){rounded(x,.55,z,4.4,1.1,1,0xa58c66);box(x,1.14,z,4.55,.12,1.1,0xf0e1ba,true);rounded(x+1.3,1.39,z,.55,.4,.48,0x526b5b);box(x+1.3,1.6,z,.45,.25,.09,0xa7c1a1)}
function shelves(x,z,kind='garden'){
 // Replace the unsupported generic shelf with braced fixtures on the same footprint.
 for(const side of [-1,1])for(const depth of [-.3,.3])box(x+side*1.94,1.02,z+depth,.07,2.04,.07,0x526762);
 box(x,1.02,z-.34,3.88,.07,.055,0x526762);
 for(let i=0;i<3;i++){
  box(x,.45+i*.65,z,4,.1,.65,0x9a8060);
  for(let j=0;j<5;j++){
   const xx=x-1.5+j*.75,yy=.68+i*.65;
   if(kind==='hardware'){
    if(i===0){rounded(xx,yy,z,.48,.35,.43,0x557d7c);box(xx,yy+.19,z,.25,.05,.09,0x364c4c);}
    else{cyl(xx,yy,z,.035,.36,0xa58a60);box(xx,yy+.2,z,.26,.1,.12,0x819494);}
   }else if(kind==='packaging'){
    rounded(xx,yy,z,.48,.35,.42,0xc3ae89);box(xx,yy,z+.22,.15,.3,.012,0x4c7576);
   }else if(i===0){rounded(xx,yy,z,.5,.35,.43,0x84785a);box(xx,yy,z+.225,.28,.16,.012,0xc1c796);}
   else{rounded(xx,yy,z,.34,.35,.15,[0x799468,0xc0a266,0x9b819c][j%3]);box(xx,yy+.04,z+.09,.22,.09,.015,0xe2ddc3);}
  }
 }
}
// Coastal terrain: bright grass, warm sidewalks, a blue bay, and rounded hills.
box(0,-.35,0,220,.6,185,0xa1b879);box(0,-.45,128,700,.1,140,0x80bcc8);box(0,-.22,81,220,.1,24,0xdccca0);for(let i=0;i<9;i++)box(0,-.38,86+i*6,240,.02,.12,0xb6d9d8);
box(0,-.015,0,180,.04,12,0x7d857e);box(0,-.015,0,12,.04,145,0x7d857e);for(let z of [-9,9])box(0,.03,z,180,.15,5,0xd3c9ae);for(let x of [-9,9])box(x,.03,0,5,.15,145,0xd3c9ae);for(let x=-86;x<90;x+=7)box(x,.01,0,3,.015,.12,0xece3bb);for(let z=-68;z<70;z+=7)box(0,.01,z,.12,.015,3,0xece3bb);for(let x=-5;x<6;x+=1.5)box(x,.02,7.5,.7,.02,2.5,0xf0e8ce);for(let z=-5;z<6;z+=1.5)box(-7.5,.02,z,2.5,.02,.7,0xf0e8ce);box(-53,-.02,26,38,.08,27,0xc5b899);box(-32,-.01,26,32,.04,4,0xc5b899);
room(-25,19,18,13,'PALM COURT MOTEL',0xe0c89f,0xbc8667);counter(-25,19);addPoint('reception','Palm Court · Rent a room',-25,22,{actor:bobble(-25,17,0x89a3a3,0xd8af89)});
room(-25,40,18,17,'ROOM 04 · WORKSHOP',0xe4d6b3,0xbf8b70);box(-31,.5,44,2,1,3.1,0xb79d76,true);rounded(-31,1.06,44,2,.22,3.1,0xe8d7ad);rounded(-31,1.25,43.1,1.7,.22,.7,0xf9efd7);addPoint('bed','Rest until morning',-29,44);box(-18,.65,35,3.3,1.3,1.1,0xabc0b4,true);rounded(-18,1.35,35,2.4,.15,.8,0xf0ede0);cyl(-18,1.6,35,.04,.4,0x8b9d97);box(-17.8,1.78,35,.4,.06,.06,0x8b9d97);addPoint('sink','Sink · Fill watering can',-18,37);box(-18,.6,43,4,1.2,1.25,0xb59b71,true);box(-18,1.25,43,4.2,.12,1.4,0xe6cfa1);rounded(-19,1.48,43,.8,.3,.7,0xa8b98b);cyl(-17,1.47,43,.35,.35,0xe1c291);addPoint('craft','Gummy-making table',-18,45);sign('MAKE IT SWEET',-18,2.35,43.5,3,'#9c7759','#fff1c6');
room(25,22,18,17,'MILO’S GARDEN GOODS',0xc7d3af,0x819c79);counter(25,23);shelves(19,16);shelves(31,16);addPoint('dealer','Milo · Seeds & soil',25,26,{actor:bobble(25,21,0xa1ac70,0xc79570)});
room(-24,-23,20,17,'HANK’S HARDWARE',0xe0c9a1,0x8fa7a1);counter(-24,-21);shelves(-31,-29,'hardware');shelves(-17,-29,'hardware');addPoint('hardware','Hank · Tents & equipment',-24,-18,{actor:bobble(-24,-23,0xbd8c68,0xe0b68c)});
room(24,-25,20,18,'THE CORNER STORE',0xe5d0a6,0xc78a70);counter(24,-23);shelves(17,-32,'packaging');shelves(31,-32,'packaging');addPoint('store','Corner store · Packaging',24,-20,{actor:bobble(24,-25,0x829fac,0xc88e67)});
room(53,22,19,17,'SUDS & SUNSHINE',0xc0d3c8,0x87aeb1);for(let i=0;i<4;i++){rounded(47+i*4,1,17,2.7,2,1.6,0xf0ead8);let drum=cyl(47+i*4,1,17.85,.65,.12,0x7fa7aa);drum.rotation.x=Math.PI/2;sphere(47+i*4,1,17.96,.5,0x547b85,scene,1,1,.13)}counter(53,24);addPoint('laundry','Suds · Business banking',53,27,{actor:bobble(53,22,0xb994a6,0xd9b797)});
room(54,-25,21,19,'CEDAR BAY LETTINGS',0xd7d2bd,0xb99775);counter(54,-24);addPoint('property','Lettings · Better homes',54,-21,{actor:bobble(54,-26,0x819777,0xc99d7d)});
room(-53,-25,18,18,'THE HELPING HAND',0xd8c6b7,0x9b91a9);counter(-53,-23);addPoint('helpers','Helping Hand · Hire staff',-53,-20,{actor:bobble(-53,-25,0x8989a5,0xe0b18d)});
room(54,51,27,22,'THE HILLSIDE HOUSE',0xd9d6b4,0xa5967b);addPoint('house','Hillside house · Property',54,58);room(-54,55,24,20,'OLD HARBOR WORKSHOP',0xc6ceba,0x86a2a4);addPoint('workshop','Harbor workshop · Property',-54,61);
// Gramps’ weathered RV: open side door, chunky wheels, orange stripes and a cramped interior.
const rv=new THREE.Group();rv.position.set(-58,0,26);scene.add(rv);box(0,.85,0,4.2,.22,9,0xb89b73,false,rv);box(-2.05,1.95,0,.2,2.2,9,0xe9d9b5,false,rv);box(2.05,1.95,-2.65,.2,2.2,3.7,0xe9d9b5,false,rv);box(2.05,1.95,3.1,.2,2.2,2.8,0xe9d9b5,false,rv);box(0,1.95,-4.4,4.2,2.2,.2,0xe9d9b5,false,rv);box(0,1.4,4.4,4.2,1.1,.2,0xe9d9b5,false,rv);rounded(-.8,1.18,-2.6,1.8,.5,2.8,0xbdbb91,rv);rounded(-.8,1.5,-3.2,1.6,.2,.7,0xe6dcc0,rv);box(-1,1.35,2.5,1.4,.8,2.1,0x9b8263,false,rv);box(-1,1.8,2.5,1.5,.1,2.2,0xd8c39b,false,rv);box(-1,2.6,2.5,1.4,.7,1.8,0xc0a67c,false,rv);box(0,1.4,4.52,3.7,.55,.06,0xc1885d,false,rv);box(0,1.15,-4.52,3.8,.45,.07,0xc1885d,false,rv);for(let side of [-1,1]){box(side*2.12,1.35,0,.04,.42,8.4,0xc1885d,false,rv);for(let zz of [-2.8,2.7]){let wheel=cyl(side*2.05,.65,zz,.63,.28,0x444c49,rv);wheel.rotation.z=Math.PI/2;let hub=cyl(side*2.22,.65,zz,.33,.05,0xc3c0ae,rv);hub.rotation.z=Math.PI/2;}for(let zz of [-2.8,.5]){if(side===1&&zz===.5)continue;rounded(side*2.14,2.25,zz,.08,.9,1.5,0x80aeb0,rv);box(side*2.21,2.25,zz,.03,.04,1.5,0xf7ead2,false,rv)}}box(0,2.7,4.52,3.3,.75,.04,0x8bb9ba,false,rv);box(0,.7,4.7,4.2,.22,.3,0x9b9f91,false,rv);box(0,3.16,0,4.3,.16,8.6,0xf2e5c4,false,rv);rounded(0,3.4,-1.8,2,.5,2.3,0xbebda8,rv);sign('SWEET RETIREMENT',-58,2.35,30.58,3,'#d8c69c','#6e7656');colliders.push({x:-60.05,z:26,w:.7,d:9.5},{x:-55.95,z:23.35,w:.7,d:4.2},{x:-55.95,z:29.1,w:.7,d:3.3},{x:-58,z:21.6,w:4.6,d:.6},{x:-58,z:30.4,w:4.6,d:.6},{x:-58.8,z:23.4,w:2,d:2.8},{x:-59,z:28.5,w:1.6,d:2.4});box(-54.8,.2,27,1.4,.4,1.7,0xaea88f);box(-55.84,1.5,28.25,.06,2.2,1,0xe0c89e);box(-55.8,1.5,28.25,.03,1.7,.7,0xf2e0b9);sign('GRAMPS’ RV',-58,3.95,30.4,4,'#748263','#fff0c2');box(-58,.03,33,8,.05,3,0xb0b38a);box(-61,.4,34,2,.8,.6,0x8b7761);box(-55,.4,34,2,.8,.6,0x8b7761);
attachObjectSilhouette(rv,'rv');
// Public payphone outside the campsite.
box(-47,1.45,29,.45,2.9,.5,0x8d9b8e,true);rounded(-47,2.25,29,1.1,1.55,.6,0x748e83);box(-47,2.25,29.34,.88,1.28,.08,0xd7d7bf);rounded(-47.27,2.28,29.44,.18,.65,.18,0x455f57);for(let i=0;i<9;i++)box(-46.92+(i%3)*.12,2.48-Math.floor(i/3)*.13,29.42,.07,.07,.03,0x748c7d);sign('PAYPHONE',-47,3.32,29.3,2.1,'#6d927c','#fff0c5');addPoint('payphone','Payphone · Call Gramps',-47,30.5);
for(let x=-4;x<=4;x+=1.3)box(x,-.02,85,1.2,.22,22,0xb99d77);for(let z of [76,83,90,96])for(let x of [-4.5,4.5]){cyl(x,.7,z,.1,1.5,0x967b59);box(x,1.35,z,.1,.12,6,0xc4ab80)}addPoint('pier','Pier · Watch the bay',0,80);
for(let i=0;i<31;i++){let x=-85+(i*43)%170,z=(i%2?-1:1)*(60+(i%4)*4);if(Math.abs(x)<12)continue;tree(x,z,.7+(i%3)*.16)}for(let i=0;i<12;i++){let x=-93+i*17;sphere(x,3,-92,18,0x9fbc8e,scene,1,1.2,1);sphere(x+8,1,-103,25,0xa5c49a,scene,1,1.3,1)}
for(let x of [-72,-38,-15,14,39,72])for(let z of [-9,9]){cyl(x,2.6,z,.08,5.2,0x6e7e6e);let curved=box(x+.25,5.18,z,.65,.08,.1,0x6e7e6e);rounded(x+.48,5.1,z,.65,.15,.38,0xf3e1ad);let l=new THREE.PointLight(0xffe0a4,0,12);l.position.set(x+.5,4.9,z);scene.add(l);lights.push(l)}
for(let i=0;i<12;i++){let x=-75+i*13,z=i%2?10:-10;box(x,.35,z,1.6,.7,.65,0xc1a378);box(x,.77,z,1.8,.08,.8,0xd3b58d);box(x,1,z-.3,1.8,.7,.09,0xc1a378);sphere(x+4,.4,z,.6,0x94ad71,scene,1,.8,1)}
// Cute cars with rounded body panels, fat wheels and pastel paint.
function car(x,z,color,angle=0){
const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);
const paint=new THREE.MeshStandardMaterial({color,roughness:.36,metalness:.18});
let body=rounded(0,.66,0,1.88,.58,3.9,color,g);body.material=paint;
rounded(0,.84,1.29,1.78,.16,1.16,color,g).material=paint;
rounded(0,.85,-1.5,1.8,.17,.74,color,g).material=paint;
let cabinGeo=new THREE.BoxGeometry(1.62,.78,1.98),pos=cabinGeo.attributes.position;
for(let i=0;i<pos.count;i++){if(pos.getY(i)>0){pos.setX(i,pos.getX(i)*.81);pos.setZ(i,pos.getZ(i)*.67-.08)}}cabinGeo.computeVertexNormals();
let glass=new THREE.Mesh(cabinGeo,new THREE.MeshStandardMaterial({color:0x31484a,roughness:.13,metalness:.45}));glass.position.set(0,1.15,-.15);g.add(glass);
rounded(0,1.55,-.23,1.4,.09,1.4,color,g).material=paint;
for(let side of [-1,1]){
for(let zz of [-1.23,1.22]){let wheel=new THREE.Mesh(new THREE.TorusGeometry(.3,.105,8,16),mat(0x252e2d));wheel.rotation.y=Math.PI/2;wheel.position.set(side*.94,.43,zz);g.add(wheel);let hub=cyl(side*1.035,.43,zz,.225,.04,0x9ca7a2,g,12);hub.rotation.z=Math.PI/2;let cap=cyl(side*1.064,.43,zz,.11,.045,0x53605d,g,8);cap.rotation.z=Math.PI/2;}
box(side*.825,1.17,-.27,.055,.7,.06,color,false,g);box(side*.84,.92,-.15,.04,.06,1.95,color,false,g);rounded(side*1.01,1.13,.65,.25,.17,.26,color,g);box(side*.953,.88,-.42,.025,.055,.22,0xbfc4b5,false,g);
rounded(side*.56,.71,1.97,.44,.22,.035,0xe4d8aa,g);rounded(side*.64,.73,-1.97,.3,.18,.035,0x9b4c36,g);
}
rounded(0,.47,1.95,1.75,.12,.15,0x68746f,g);rounded(0,.47,-1.95,1.75,.12,.15,0x68746f,g);box(0,.63,1.985,.55,.21,.02,0xbdb9a0,false,g);for(let i=0;i<3;i++)box(0,.87+i*.04,1.976,.53,.018,.02,0x43504b,false,g);
return g;
}
// Parked cars never move, so the static batcher may fold them into the town batches.
for(const c of [car(-20,5,0xddb675,Math.PI/2),car(32,-5,0xb2c9bb,Math.PI/2),car(65,5,0xcb9380,Math.PI/2)])c.userData.batchStatic=true;
CONTACTS.forEach((c,i)=>{let g=bobble(c.x,c.z,c.color,c.skin,[0x544833,0x725c42,0x4d4539,0x8b6d45,0x755944][i]);people.push(g);addPoint('customer',c.name,c.x,c.z+1,{i,actor:g})});let milo=bobble(30,31,0xa4b476,0xd2ac81);addPoint('dealer','Milo’s seed cart',30,32.3,{actor:milo});let patrol=bobble(6,-40,0x768fa0,0xd2b192,0x596052);patrol.userData.cop=true;
// One physical grow tent for every owned tent. Purchase once; keep using it.
for(let i=0;i<8;i++){let x=-31+(i%4)*3.3,z=35+Math.floor(i/4)*5.8,g=new THREE.Group();g.position.set(x,0,z);scene.add(g);box(0,.04,0,2.4,.08,2.4,0xa3b29f,false,g);box(-1.15,1.15,0,.1,2.3,2.4,0x657f73,false,g);box(1.15,1.15,0,.1,2.3,2.4,0x657f73,false,g);box(0,1.15,-1.1,2.4,2.3,.1,0x7f9686,false,g);box(0,2.3,0,2.4,.1,2.4,0x596f62,false,g);box(0,2.13,0,1.7,.06,1.4,0xece6b1,false,g);cyl(0,.35,0,.6,.7,0xbba37d,g);cyl(0,.72,0,.54,.05,0x6b6048,g);const plant=new THREE.Group();plant.position.y=.7;g.add(plant);cyl(0,.45,0,.045,.9,0x7e9c50,plant);for(let j=0;j<6;j++){let a=j*Math.PI*.7;let leaf=sphere(Math.sin(a)*.23,.2+j*.11,Math.cos(a)*.23,.27,0x87b45a,plant,1.4,.4,.6);leaf.rotation.z=Math.sin(a)*.5}sphere(0,.95,0,.18,0x9cc864,plant,.8,1.3,.8);plantVisuals.push(plant);tents.push(g);addPoint('tent','Grow tent '+(i+1),x,z+1.6,{i})}
const beacon=new THREE.Group();scene.add(beacon);let beam=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,12,6),new THREE.MeshBasicMaterial({color:0xffe4a2,transparent:true,opacity:.5,depthWrite:false}));beam.position.y=6;beacon.add(beam);let arrow=new THREE.Mesh(new THREE.ConeGeometry(.4,.7,4),mat(0xffdf89));arrow.position.y=3;arrow.rotation.z=Math.PI;beacon.add(arrow);
// v129: the old hard-edged sphere clouds read as blimps; soft sky-clouds.mjs billboards replace them.
for(let i=0;i<14;i++){let x=40+i*2;box(x,.6,66,.12,1.2,.12,0xe4dac0);if(i<13){box(x+1,.9,66,2,.08,.07,0xe4dac0);box(x+1,.35,66,2,.08,.07,0xe4dac0)}}
for(let i=0;i<10;i++){let x=-36+i*.7;let z=49.4;cyl(x,.2,z,.025,.4,0x87a267);sphere(x,.46,z,.15,[0xe3b4b8,0xe7cf83,0xc7b5d7][i%3]);}
const hand=new THREE.Group();camera.add(hand);const playerHand=createChunkyPlayerHand(hand);const watering=new THREE.Group();camera.add(watering);watering.visible=false;rounded(.36,-.3,-.7,.35,.4,.3,0x82b9b6,watering);let spout=cyl(.15,-.2,-.85,.045,.4,0x82b9b6,watering);spout.rotation.z=-.6;scene.add(camera);
const level=()=>levelOf(s.xp);const cash=n=>'$'+Number(n).toLocaleString('en-US',{maximumFractionDigits:2});const unlocked=t=>level()>=STRAINS[t].level;const value=t=>Math.round(STRAINS[t].price*(1+s.bench*.15)*listedQuality(s,t));const availableMoney=()=>s.payment==='card'?s.bank:s.cash;
function spend(n,bank=false){let useCard=bank||s.payment==='card',key=useCard?'bank':'cash';if(s[key]<n){toast('Not enough '+(useCard?'card funds. Deposit cash at an ATM.':'cash. Switch payment to card or visit an ATM.'));return false}s[key]=Math.round((s[key]-n)*100)/100;if(useCard)record('Card payment',-n);return true}
function toast(msg){if(processingRemote){netSend({type:'toast',msg});return}$('toast').textContent=msg;$('toast').style.opacity=1;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.opacity=0,4200)}
function save(){if(!active||net.role==='guest'||processingRemote)return;s.x=player.x;s.z=player.z;s.yaw=yaw;s.pitch=pitch;s.savedAt=Date.now();try{localStorage.setItem('gummybay-v3-'+mode+'-'+slot,JSON.stringify(s))}catch(e){toast('Browser saving is unavailable. Export a backup from Menu.')}}
function lock(){mouseInside=false;document.body.classList.remove('titleMode');}
function close(){if(processingRemote)return;if(!active){menu('title');return}panel='';conversationPoint=null;document.body.dataset.panel='';$('overlay').hidden=true;keys={};lock()}
function row(title,desc,label,action,disabled=false){return `<div class="item"><div><strong>${title}</strong><p>${desc}</p></div><button class="primary" onclick="${action}" ${disabled?'disabled':''}>${label}</button></div>`}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function load(modeIn,slotIn=1,newRun=false){disconnect(false);mode=modeIn;slot=slotIn;s=fresh(mode);if(!newRun)try{let old=JSON.parse(localStorage.getItem('gummybay-v3-'+mode+'-'+slot));if(old?.version===3&&old.mode===mode){normalize(old);s={...s,...old}}}catch(e){}normalize(s);active=true;player.set(s.x,1.72,s.z);yaw=s.yaw;pitch=s.pitch||0;settleSpawn();track=null;close();save();toast(s.called?'Welcome back. Your business is right where you left it.':'The RV is all Gramps left you. That payphone is ringing.');}
function slots(modeIn){if(active)save();active=false;panel='slots';document.exitPointerLock?.();$('overlay').hidden=false;let h='<button class="close" onclick="title()">×</button><div class="overline">'+modeIn.toUpperCase()+' / SAVE GAMES</div><h2>A fresh start. Your own pace.</h2><p>Every new save starts with exactly $400, no room and no equipment. '+(modeIn==='story'?'Gramps’s calls guide you, but every objective is optional.':'Open-ended free play. Gramps’s optional help is still available.')+'</p>';for(let i=1;i<=3;i++){let old;try{old=JSON.parse(localStorage.getItem('gummybay-v3-'+modeIn+'-'+i))}catch(e){}h+=row('Save '+i,old?'Day '+old.day+' · '+cash(old.cash+old.bank)+' · '+old.sold+' gummies sold':'Empty · $400 and an old RV',old?'Continue':'New game',`startRun('${modeIn}',${i})`)}$('modal').innerHTML=h;}
function title(){save();disconnect(false);active=false;menu('title')}
function menu(which,data){if(processingRemote)return;if(!active&&!['title','slots','join','host','network'].includes(which))return;if(work&&which!=='pause')return;clearExchangeGesture();conversationPoint=conversationPointFor(which,data);panel=which;document.body.dataset.panel=which;const summary=document.getElementById('businessHUD');if(summary)summary.hidden=true;if(!active){const receipt=document.getElementById('moneyReceipt');if(receipt)receipt.hidden=true;}keys={};locomotion.jumpQueued=0;document.exitPointerLock?.();$('overlay').hidden=false;$('overlay').classList.toggle('phone',which==='phone'||which==='thread');let h=which==='title'?'':'<button class="close" onclick="closeMenu()" aria-label="Close">×</button>';const tag=t=>'<div class="overline">'+t+'</div>';
if(which==='title'){h+=tag('A CARTOON COASTAL BUSINESS SANDBOX')+'<h1>Gramps got caught.<br>You got the RV.</h1><p class="big">He’s in jail for selling gummy clusters. You’ve got $400, his old camper, and one last call from a payphone. Time to build something of your own.</p><div class="choiceGrid"><button class="choice" onclick="slots(\'story\')"><span class="tag">STORY + OPTIONAL TUTORIAL</span><h3>Gramps’ last call →</h3><p>Rent your first room. Learn every step. Build up from nothing, one gummy at a time.</p></button><button class="choice" onclick="slots(\'free\')"><span class="tag">FREE PLAY / SEPARATE SAVES</span><h3>Your own story →</h3><p>The same $400 start and progression, with no mandatory objectives. Play at your pace.</p></button></div><button class="ghost" onclick="menu(\'join\')">Join multiplayer co-op</button><p class="note">Original characters and town inspired by the cartoon business-sim style. Fictional gummies, seeds and growing mechanics. Single-player or 2-player peer-to-peer co-op. Host a saved game from Menu → Multiplayer.</p><p>WASD move · mouse / drag to look · E interact · T phone · Tab backpack<br>Hold and drag to look. Full mouse capture is available in Settings.</p>';}
if(which==='payphone'){h+=tag('COLLECT CALL / COUNTY JAIL')+'<h2>“Kid? It’s Gramps.”</h2><div class="message">“They caught me selling gummy clusters out the back of the RV. Don’t ask. My retirement plan has hit a small legal snag.”</div><div class="message">“There’s four hundred dollars in your wallet. That’s all of it. Palm Court will rent you Room 04 for $75. You need a roof and a place to work.”</div><div class="message">“Hank sells a basic grow tent for $100 and a watering can for $15. Milo has seeds and soil. You also need $10 trimmers and a $100 packaging station. Buy only what you need. You’ve got to grow, water, harvest, make, and pack every gummy yourself.”</div><div class="message">“And listen: customers don’t run your business. Set your own listing, text them, negotiate a price, then meet them. Call me again when you’ve made a sale.”</div><button class="primary" onclick="action(\'call\')">I’ll figure it out, Gramps.</button>';if(s.called)h+='<p class="note">Gramps: “If you get stuck, check your journal. One small step at a time.”</p>';}
if(which==='reception'){h+=tag('PALM COURT / RECEPTION')+'<h2>A roof over your head.</h2><p>“Room 04 is basic. A bed, a sink and an old worktable. $75 gets you the keys. I’ll charge $15 each morning you choose to sleep.”</p>'+row('Rent Room 04','One-time key deposit · unlocks your sink, worktable and tent space.',s.room?'RENTED':'$75',"action('rent')",s.room||availableMoney()<75)+row('Reception shift','Need to recover? Earn $35 clean by completing a 40-second shift.',s.job?(Date.now()>=s.job?'Collect $35':'Working…'):'Take shift',"action('job')",!!s.job&&Date.now()<s.job);}
if(which==='hardware'){h+=tag('HANK’S HARDWARE')+'<h2>Start small. Upgrade smart.</h2><p>Your first tent arrives empty. Every tent is a one-time purchase and can grow one plant at a time. Install it back at your room.</p>';h+=row('Basic grow tent · '+s.tents+' owned',s.room?'Reusable tent frame, planter and basic light.':'Rent a room before buying equipment.',cash(100),"action('buyTent')",!s.room||s.tents>=maxTents()||availableMoney()<100);h+=row('Watering can','Reusable · fill free at your room’s sink.',s.can?'OWNED':'$15',"action('buyCan')",s.can||availableMoney()<15);h+=row('Grow lights · '+s.lights+'/3','Level 2+ · each upgrade speeds growing by 15%.',level()<2?'LEVEL 2':cash(180+s.lights*170),"action('lights')",level()<2||s.lights>=3||availableMoney()<180+s.lights*170);h+=row('Automatic irrigation','Level 3 · waters plants automatically. Still needs your can installed.',s.irrigation?'OWNED':level()<3?'LEVEL 3':'$450',"action('irrigation')",s.irrigation||!s.can||level()<3||availableMoney()<450);h+=row('Gummy press · '+s.bench+'/3','Level 2+ · quicker crafting, +15% gummy value each level.',level()<2?'LEVEL 2':cash(220+s.bench*200),"action('bench')",level()<2||s.bench>=3||availableMoney()<220+s.bench*200);}
if(which==='dealer'){h+=tag('MILO / INDEPENDENT SEED DEALER')+'<h2>From tiny things.</h2><p>“Just one seed and a little patience. Soil runs out, the tent doesn’t.”</p>';STRAINS.slice(0,BASE_COUNT).forEach((t,i)=>h+=row(t.name+' seed',`${t.desc} · ${s.seeds[i]} owned · harvest 4 units`,unlocked(i)?cash(t.seed):'LEVEL '+t.level,`action('seed',${i})`,!unlocked(i)||availableMoney()<t.seed));h+=row('Potting soil · 1 use','Prepare fresh soil for every crop. '+s.soil+' uses owned.','$10',"action('soil')",availableMoney()<10);}
if(which==='store'){h+=tag('THE CORNER STORE')+'<h2>The finishing touches.</h2><p>Every gummy needs a wrapper before you can deliver it.</p>'+row('Gummy wrappers · pack of 10',s.wrappers+' wrappers in your backpack.','$10',"action('wrappers')",availableMoney()<10)+row('Cold lemonade','Restores your sprint stamina.','$5',"action('lemonade')",availableMoney()<5);}
if(which==='tent'){selected=data??selected;h+=tag('ROOM 04 / TENT '+(selected+1))+'<h2>'+tentTitle(selected)+'</h2>';if(!s.room)h+='<p>You need to rent the room first.</p>';else if(selected>=s.tents)h+='<p>Buy a grow tent from Hank’s Hardware.</p>';else if(!s.installed?.includes(selected))h+=row('Install your grow tent','Reusable equipment. Set it up once.','Install',`action('install',${selected})`);else{let p=s.plants[selected];if(!p)h+=row('Prepare the planter',s.soil+' soil uses remaining. Add fresh soil before a seed.','Add soil',`action('prepare',${selected})`,!s.soil);else if(p.phase==='soil'){h+='<p>Fresh soil is ready. Pick a seed from your backpack.</p>';STRAINS.slice(0,BASE_COUNT).forEach((t,i)=>h+=row(t.name,s.seeds[i]+' seeds ready.','Plant',`action('plant',${selected},${i})`,!s.seeds[i]||!unlocked(i)))}else if(p.phase==='dry'||p.phase==='thirsty')h+=row(STRAINS[p.t].name+' needs water',!s.can?'Buy a watering can from Hank.':s.water+' / 6 water charges · fill at the sink.', 'Water',`action('water',${selected})`,!s.can||!s.water);else if(p.phase==='mature')h+=row(STRAINS[p.t].name+' · ready',s.trimmers?'Harvest 4 units for making gummies.':'Buy $10 trimmers from Hank first.','Harvest',`action('harvest',${selected})`,!s.trimmers);else h+='<p>Growing · '+Math.max(0,Math.ceil((p.end-Date.now())/1000))+'s until '+(p.waterings===1?'it needs more water.':'harvest.')+'</p>';}}
if(which==='sink'){h+=tag('ROOM 04 / SINK')+'<h2>A little water goes a long way.</h2>'+row('Fill watering can',s.can?s.water+' / 6 charges. Water is free.':'You need a watering can from Hank.',s.water===6?'FULL':'Fill can',"action('fill')",!s.can||!s.room||s.water>=6);}
if(which==='craft'){h+=tag('ROOM 04 / YOUR WORKTABLE')+'<h2>Make every gummy yourself.</h2><p>Shape harvested ingredients into a fictional gummy, then use a wrapper to pack it. Each button handles one gummy; hired helpers can take over later.</p>';STRAINS.forEach((t,i)=>{if(s.raw[i]||s.gummies[i]||s.packs[i]){h+=row(t.name,`${s.raw[i]} harvested · ${s.gummies[i]} made · ${s.packs[i]} packed`,'Make 1',`action('make',${i})`,!s.room||!s.raw[i]);h+=row('Wrap '+t.name,`${s.gummies[i]} unwrapped · ${s.wrappers} wrappers`,'Pack 1',`action('pack',${i})`,!s.room||!s.packStation||!s.gummies[i]||!s.wrappers)}});if(!s.raw.some(n=>n)&&!s.gummies.some(n=>n)&&!s.packs.some(n=>n))h+='<p>Harvest a mature plant first. It supplies the ingredients for four gummies.</p>';}
if(which==='bag'){h+=tag('BACKPACK')+'<h2>Everything you’re carrying.</h2>';h+=row('Equipment',`${s.tents} tents (${s.installed?.length||0} installed) · ${s.can?'watering can '+s.water+'/6':'no watering can'} · ${s.soil} soil · ${s.wrappers} wrappers`,'Shop map',"menu('map')");STRAINS.forEach((t,i)=>{if(t.mixed&&!s.gummies[i]&&!s.packs[i])return;h+=row(t.name,`${s.seeds[i]} seeds · ${s.raw[i]} harvested · ${s.gummies[i]} unwrapped · ${s.packs[i]} packed`,'List',`menu('listing',${i})`,!s.packs[i]);});}
if(which==='phone'){h+=tag('YOUR PHONE / GUMMY BAY MOBILE')+'<h2>Your business. In your pocket.</h2><div class="tabs"><button onclick="menu(\'phone\')" class="on">Messages</button><button onclick="menu(\'listing\')">Your listing</button><button onclick="menu(\'deals\')">Agreed deals</button></div>';if(!s.listing)h+='<p>Make and pack a gummy, then create your own listing before texting a customer.</p>';else h+='<p>Your listing: '+s.listing.qty+' × '+STRAINS[s.listing.t].name+' at <strong>'+cash(s.listing.price)+' each</strong>.</p>';CONTACTS.forEach((c,i)=>{let t=s.threads[i],last=t?.messages?.at(-1),memory=customerBrief(s,i,STRAINS.length);h+='<article class="contact-card"><div class="contact-heading"><span class="contact-initial">'+esc(c.name[0])+'</span><div><strong>'+esc(c.name)+'</strong><small>'+esc(residentStatus(i))+'</small></div></div><p>'+esc(last?last.text:c.line)+'</p>'+customerMemoryHTML(memory)+'<div class="order-actions"><button class="primary" onclick="menu(\'thread\','+i+')">'+(t?'Open chat':'Text')+'</button><button class="ghost" onclick="trackCustomer('+i+')">Find in town</button></div></article>'});}
if(which==='listing'){let t=Number.isInteger(data)?data:s.listing?.t??s.packs.findIndex(n=>n>0);if(t<0)t=0;h+=tag('PHONE / MARKETPLACE')+'<h2>Set your asking price.</h2><p>You choose the product, quantity and price. Then send your listing to customers through Messages. Listing alone doesn’t sell anything.</p><div class="form"><select id="listType">'+STRAINS.map((p,i)=>({p,i})).filter(({p,i})=>!p.mixed||s.packs[i]||s.gummies[i]).map(({p,i})=>`<option value="${i}" ${t===i?'selected':''}>${p.name} · ${s.packs[i]} packed</option>`).join('')+'</select><label>Qty <input id="listQty" type="number" min="1" max="40" value="'+(s.listing?.qty||1)+'"></label><label>$ / gummy <input id="listPrice" type="number" min="1" max="9999" value="'+(s.listing?.price||value(t))+'"></label></div><button class="primary" onclick="action(\'list\',Number(document.getElementById(\'listType\').value),Number(document.getElementById(\'listQty\').value),Number(document.getElementById(\'listPrice\').value))">Save listing</button><p class="note">Typical Pine Pop value starts around $30. Customers have different budgets and remember the current negotiation. Try an offer and bargain.</p>';}
if(which==='thread'){selected=data??selected;const c=CONTACTS[selected],thread=s.threads[selected];h+=`<div class="phoneheader"><div class="avatar">${c.name[0]}</div><div><div class="overline">TEXT MESSAGES</div><h2 style="margin:3px 0">${c.name}</h2></div></div>`;if(thread)thread.messages.forEach(m=>h+=`<div class="message ${m.mine?'mine':''}"><small>${m.mine?'YOU':c.name.toUpperCase()}</small>${esc(m.text)}</div>`);else h+='<div class="message">'+c.line+'</div>';let deal=s.deals.find(d=>d.npc===selected);if(deal){h+=row('Deal agreed',deal.qty+' × '+STRAINS[deal.t].name+' · '+cash(deal.price)+' each','Track meeting',`trackCustomer(${selected})`)}else if(thread?.status==='negotiating'){h+='<div class="form"><label>Your counter $ / gummy <input id="offerPrice" type="number" min="1" max="9999" value="'+thread.counter+'"></label><button class="primary" onclick="action(\'offer\','+selected+',Number(document.getElementById(\'offerPrice\').value))">Text offer</button></div><button class="ghost" onclick="action(\'offer\','+selected+','+thread.counter+')">Accept '+cash(thread.counter)+' each</button>';}else h+=row('Send your current listing',s.listing?s.listing.qty+' × '+STRAINS[s.listing.t].name+' at '+cash(s.listing.price)+' each.':'Create a listing first.','Text listing',`action('text',${selected})`,!s.listing);}
if(which==='deals'){h+=tag('PHONE / AGREED DEALS')+'<h2>A handshake comes later.</h2>';if(!s.deals.length)h+='<p>No deals yet. Set a listing, text a customer and agree on a price.</p>';s.deals.forEach(d=>h+=row(CONTACTS[d.npc].name,d.qty+' × '+STRAINS[d.t].name+' · '+cash(d.price*d.qty)+' total','Track',`trackCustomer(${d.npc})`));}
if(which==='customer'){selected=data;let c=CONTACTS[data],d=s.deals.find(d=>d.npc===data);h+=tag('GUMMY BAY / '+c.name.toUpperCase())+'<h2>'+esc('“'+customerBrief(s,data,STRAINS.length).greeting+'”')+'</h2>';if(d)h+=row(d.qty+' × '+STRAINS[d.t].name,`Agreed price: ${cash(d.price)} each · total ${cash(d.price*d.qty)}<br>You have ${s.packs[d.t]} packs`,'Deliver',`action('deliver',${data})`,s.packs[d.t]<d.qty||!customerExchangeStatus(data).ok).replace('<button ','<button id="customerDeliver" ');else h+='<p>“Text me first. I’d rather agree on what I’m buying before we meet.”</p><button class="primary" onclick="menu(\'thread\','+data+')">Open texts</button>';}
if(which==='helpers'){h+=tag('THE HELPING HAND / STAFF')+'<h2>More hands. More possibilities.</h2><p>Helpers work in the background while the game is running. They use your existing stock. No hidden daily wages: each hire is a one-time fee.</p>';[['gardener','Gardener',2,300,'Walks your tents to plant, water and harvest. Needs installed tents, soil, seeds and a filled can.'],['crafter','Gummy maker',4,900,'Makes and wraps harvested gummies. Keep wrappers in stock.'],['seller','Sales assistant',5,1300,'Walks an agreed order to the customer. The background timer still sells unreserved stock at 90% of market value.']].forEach(([k,title,l,cost,desc])=>h+=row(title,desc,s.helpers[k]?'HIRED':level()<l?'LEVEL '+l:cash(cost),`action('hire','${k}')`,s.helpers[k]||level()<l||availableMoney()<cost));}
if(which==='property'||which==='house'||which==='workshop'){h+=tag('CEDAR BAY LETTINGS / PROPERTY LADDER')+'<h2>A bigger place to grow.</h2><p>Property purchases use clean bank funds. Your production relocates to your new property when you buy it. Follow the map to your new tents, sink and worktable.</p>'+row('Room 04','2 tent spaces · your starting rental.',s.room?'RENTED':'$75',"action('rent')",s.room||availableMoney()<75)+row('Harbor workshop','Level 3 · own a workshop deed · 4 active tent spaces.',s.house>=1?'OWNED':level()<3?'LEVEL 3':'$1,200 bank',"action('house',1)",s.house>=1||level()<3||s.bank<1200)+row('Hillside house','Level 5 · own a house deed · 8 active tent spaces.',s.house>=2?'OWNED':level()<5?'LEVEL 5':'$3,500 bank',"action('house',2)",s.house>=2||level()<5||s.bank<3500);}
if(which==='laundry'){h+=tag('SUDS & SUNSHINE / BOOKKEEPING')+'<h2>Money for the next step.</h2><p>Abstract game banking: convert cash to bank funds with a fee. Property deeds require bank funds. Owning the business front reduces the fee.</p>';if(s.laundry){let ready=Date.now()>=s.laundry.end;h+=row('Pending deposit',ready?cash(s.laundry.pay)+' ready to collect':Math.ceil((s.laundry.end-Date.now())/1000)+'s remaining',ready?'Collect':'Pending',"action('withdraw')",!ready)}else [50,150,400,1000].forEach(n=>h+=row('Deposit '+cash(n),cash(Math.round(n*(s.front?.95:.9)))+' bank after 25 seconds.','Deposit',`action('deposit',${n})`,s.cash<n));h+=row('Buy Suds business front','Level 4 · lower conversion fee from 10% to 5%.',s.front?'OWNED':level()<4?'LEVEL 4':'$1,500 bank',"action('front')",s.front||level()<4||s.bank<1500);}
if(which==='bed'){h+=tag('ROOM 04 / WIND DOWN')+'<h2>Call it a day?</h2><p>Sleep until 08:00 tomorrow. Rental charge: $15. Heat clears. Growing plants advance to their next watering or harvest stage; dry plants still need watering.</p>'+row('Sleep','$15 room charge each time you choose to rest.','Sleep',"action('sleep')",!s.room||availableMoney()<15);}
if(which==='journal'){h+=tag('GRAMPS’ NOTEBOOK')+'<h2>'+(mode==='story'?STORY[Math.min(s.chapter,STORY.length-1)].title:'Your business, your pace.')+'</h2><p>'+(mode==='story'?STORY[Math.min(s.chapter,STORY.length-1)].text:'Start with the same $400 and work up from a rented room. Gramps’s tutorial calls remain available at the payphone.')+'</p><h3>Your production checklist</h3><p>Deliver the starter batch, then learn to grow.<br>1. Hand two Pine Pops to Jules when they text.<br>2. Rent Room 04 at Palm Court.<br>3. Buy a $100 tent, $15 can, $10 trimmers and $100 packaging station at Hank’s.<br>4. Buy a $30 Pine Pop seed and $10 soil from Milo.<br>5. Install the tent, add soil and plant a seed.<br>6. Fill your watering can at the sink. Water twice during the growth cycle.<br>7. Harvest 4 units. Make and wrap each gummy at the worktable.<br>8. Phone → Listing: set quantity and asking price, then text a customer.</p><h3>Level '+level()+' · '+s.xp+' XP</h3><p>+5 XP per gummy sold. Every 30 XP is a level. Higher levels unlock strains, equipment, houses and staff. Helpers automate only after you buy them.</p><button class="primary" onclick="trackObjective()">Track next step</button>';}
if(which==='map'){h+=tag('GUMMY BAY / STREET GUIDE')+'<h2>Find your feet.</h2>';for(let t of ['payphone','reception','hardware','dealer','store','tent','sink','craft','helpers','property','laundry']){let p=points.find(p=>p.type===t);h+=row(p.label,(p.x<0?'West':'East')+' side · '+(p.z<0?'north':'south')+' of Main Street','Track',`trackPlace('${t}')`)}h+='<p>Map: R RV · P payphone · M motel · H hardware · S seeds · C corner store · $ banking · L lettings · A staff. Yellow dots are customers.</p>';}
if(which==='pause'){save();h+=tag('PAUSED / '+mode.toUpperCase()+' SAVE '+slot)+'<h2>Your progress, your pace.</h2><p>Story and free mode each have three separate saves. Production pauses while this menu is open, except real-time crop timers. Browser saves stay on this device.</p>'+row('Back to the bay','Hold and drag the world to look.','Resume','closeMenu()')+row('Save current game','Save immediately to the current slot.','Save now','manualSave()')+row('Save backups','Export a file you can keep or transfer.','Export','exportSave()')+row('Import a backup','Choose a backup, then confirm the destination.','Import…','importSave()')+row('Optional multiplayer','2-player co-op · host your current save, or join a friend.','Multiplayer',"menu('network')")+row('Title & save selection','Keep your current save and choose another.','Title','title()')+row('Start this slot again','Resets only this mode and slot to the $400 RV start.','Reset…',"menu('reset')");}
if(which==='reset')h+=tag('RESET SAVE '+slot)+'<h2>Start this slot over?</h2><p>You will lose this slot’s progress. Other slots stay intact.</p><button class="primary" onclick="loadGame(modeName(),slotNumber(),true)">Reset this slot</button>';
if(which==='network'||which==='join'||which==='host'){h+=networkHTML(which)}
if(which==='importConfirm'){h+=tag('IMPORT BACKUP')+'<h2>Replace '+pendingReset.state.mode+' save '+slot+'?</h2><p>This imports the selected backup into this slot. Other slots stay intact.</p><button class="primary" onclick="confirmImport()">Import save</button>'}
if(which==='pier')h+=tag('DRIFTWOOD PIER')+'<h2>A little room to breathe.</h2><p>The gulls don’t care about your margins. Take a minute, then get back to it.</p><button class="primary" onclick="closeMenu()">Back to the bay</button>';
$('modal').innerHTML=h;}
function maxTents(){return s.house===2?8:s.house===1?4:2}function tentTitle(i){let p=s.plants[i];return !s.installed?.includes(i)?'Set up your growing space':!p?'A fresh start':p.phase==='soil'?'Ready for a seed':p.phase==='dry'||p.phase==='thirsty'?'A little water, please':p.phase==='mature'?'Ready to harvest':'Growing happily';}
const STORY=[
{title:'01 · Gramps’ starter batch',text:'Gramps left four packed Pine Pops in the RV. Jules will text. Meet them at the usual spot and hand over two at $30 each.',done:()=>s.sold>0,where:'customer'},
{title:'02 · Gramps’ last call',text:'Gramps is in jail after getting caught selling gummy clusters. Answer the payphone beside his old RV.',done:()=>s.called>0,where:'payphone'},
{title:'03 · A place to start',text:'You have $400. Rent Room 04 at Palm Court for $75. No equipment is included.',done:()=>s.room,where:'reception'},
{title:'04 · The bare essentials',text:'Buy one reusable grow tent ($100) and a watering can ($20) from Hank.',done:()=>s.tents>0&&s.can,where:'hardware'},
{title:'05 · Find your seed guy',text:'Visit Milo. Buy a Pine Pop seed ($30) and soil ($10 per bag).',done:()=>s.seeds.some(n=>n)||s.planted>0,where:'dealer'},
{title:'06 · Put down roots',text:'At Room 04, install your tent, prepare the soil, then plant a seed.',done:()=>s.planted>0,where:'tent'},
{title:'07 · Don’t forget the water',text:'Fill your watering can at the sink. Water the seed; water again halfway through growth.',done:()=>s.watered>=2,where:'tent'},
{title:'08 · Your first harvest',text:'Harvest the mature plant. Bring the ingredients to the room’s worktable.',done:()=>s.harvested>0,where:'tent'},
{title:'09 · Make it by hand',text:'Buy trimmers and a packaging station from Hank, plus wrappers from the corner store. Make one gummy, then wrap it at the worktable.',done:()=>s.made>0,where:'craft'},
{title:'10 · Name your price',text:'Open your phone. Create a listing with your own quantity and asking price.',done:()=>s.listed>0,where:'craft'},
{title:'11 · Text, don’t guess',text:'Send your listing to a customer. Bargain in their message thread, then agree on a price.',done:()=>s.texted>0&&s.deals.length>0||s.sold>0,where:'craft'},
{title:'12 · Call home',text:'Gramps is waiting for news. Call him at the payphone after your first sale.',done:()=>s.called>=2,where:'payphone'},
{title:'13 · Bigger than a room',text:'Earn XP, upgrade equipment and hire your first helper. Keep building freely.',done:()=>s.hired>0,where:'helpers'},
{title:'14 · A sweet little empire',text:'Buy the Hillside house and hire all three helpers. Gramps would be proud.',done:()=>s.house===2&&Object.values(s.helpers).every(Boolean),where:'property'}];
function journeySnapshot(){return journeyProgress(STORY.map(step=>{try{return !!step.done()}catch{return false}}),s.chapter);}
function reconcileJourney(notify=false,persist=true){
 const previous=Number.isSafeInteger(s.chapter)?s.chapter:0,progress=journeySnapshot();if(!progress.changed)return progress;
 s.chapter=progress.chapter;if(persist&&active&&net.role!=='guest'&&!processingRemote)save();
 if(notify&&progress.chapter>previous&&progress.next!==null)toast('Gramps’ notebook · '+STORY[progress.next].title);
 return journeyProgress(progress.flags,s.chapter);
}
function journeyGuideHTML(full=false){
 const progress=journeySnapshot(),summary=journeySummary(progress,STORY.map(step=>step.title));
 const list=full?'<ol class="journey-list">'+STORY.map((step,index)=>'<li>'+(progress.flags[index]?'✓ ':'○ ')+esc(step.title)+'</li>').join('')+'</ol>':'';
 return '<section class="staffcard journey-guide"><h3>Gummy Bay journey · '+summary.label+'</h3><p>'+esc(summary.next)+'</p>'+list+(progress.complete?'<button class="ghost" onclick="closeMenu()">Keep exploring</button>':'<button class="primary" onclick="trackJourney()">Track next milestone</button>')+'</section>';
}
function trackPlace(type){let p=points.find(p=>p.type===type&&(type!=='tent'||p.i<s.tents))||points.find(p=>p.type===type);track={x:p.x,z:p.z,label:p.label};close();toast('Tracking '+p.label)}function trackCustomer(i){if(!Number.isInteger(i)||!CONTACTS[i])return;let c=CONTACTS[i];track={x:c.x,z:c.z,label:c.name,npc:i,type:'customer',status:'locating'};close();toast('Tracking '+c.name)}function trackObjective(){let progress=journeySnapshot(),c=STORY[Math.min(progress.chapter,STORY.length-1)];if(c.where==='customer')trackCustomer(s.deals.length?s.deals[0].npc:0);else trackPlace(c.where)}function trackJourney(){reconcileJourney(false);trackObjective()}window.trackJourney=trackJourney;
function trackNextDelivery(){const next=deliveryRound(s,CONTACTS,{x:player.x,z:player.z}).next;if(!next)return;if(next.action==='deliver')trackCustomer(next.npc);else trackPlace('craft');}
window.trackNextDelivery=trackNextDelivery;
function startWork(label,seconds,tool=false){if(processingRemote)return;close();work={label,start:performance.now(),seconds,tool};$('workLabel').textContent=label;$('work').style.display='block';watering.visible=tool;}
function refresh(which=panel,data=selected){if(processingRemote)return;save();if(which)menu(which,data)}
function doAction(k,a,b,c){
if(k==='call'){s.called=s.called===0?1:s.sold>0?2:s.called;close();toast(s.called>=2?'Gramps: “You set the price? Good. Keep reinvesting. Better kit and good people will give you your time back.”':'Gramps: “Seventy-five for the room. One hundred for the tent. Don’t spend it all at once.”');}
if(k==='rent'){if(s.room||!spend(75))return;s.room=true;toast('Room 04 is yours. The room is south of reception.');refresh('reception');}
if(k==='buyTent'){if(!s.room||s.tents>=maxTents()||!spend(100))return;s.tents++;s.plants.push(null);toast('Tent frame in your bag. Install it at Room 04.');refresh('hardware');}
if(k==='buyCan'){if(s.can||!spend(15))return;s.can=true;toast('Watering can bought. Fill it at the sink.');refresh('hardware');}
if(k==='seed'){if(!Number.isInteger(a)||!STRAINS[a]||!unlocked(a)||!spend(STRAINS[a].seed))return;s.seeds[a]++;toast(STRAINS[a].name+' seed bought');refresh('dealer');}
if(k==='soil'){if(!spend(10))return;s.soil+=1;toast('1 bag of soil added');refresh('dealer');}
if(k==='wrappers'){if(!spend(10))return;s.wrappers+=10;toast('10 wrappers added');refresh('store');}
if(k==='lemonade'){if(!spend(5))return;stamina=100;toast('A cold lemonade. Good call.');refresh('store');}
if(k==='install'){if(a<0||a>=s.tents||!s.room||s.installed?.includes(a))return;s.installed??=[];s.installed.push(a);startWork('Setting up your grow tent…',2.5);toast('Tent installed. Add soil, then a seed.');}
if(k==='prepare'){if(!s.installed?.includes(a)||s.plants[a]||!s.soil)return;s.soil--;s.plants[a]={phase:'soil'};startWork('Preparing fresh soil…',1.7);}
if(k==='plant'){if(!s.installed?.includes(a)||s.plants[a]?.phase!=='soil'||!Number.isInteger(b)||!s.seeds[b]||!unlocked(b))return;s.seeds[b]--;s.plants[a]={phase:'dry',t:b,waterings:0};s.planted++;startWork('Planting '+STRAINS[b].name+'…',1.6);toast('Seed planted. Fill your watering can and water it.');}
if(k==='fill'){if(!s.room||!s.can)return;s.water=6;startWork('Filling your watering can…',1.5,true);}
if(k==='water'){let p=s.plants[a];if(!p||!['dry','thirsty'].includes(p.phase)||!s.can||!s.water)return;s.water--;p.waterings++;p.phase='growing';p.start=Date.now();p.end=Date.now()+STRAINS[p.t].time*(1-s.lights*.15)*500;s.watered++;startWork('Watering '+STRAINS[p.t].name+'…',1.8,true);}
if(k==='harvest'){let p=s.plants[a];if(p?.phase!=='mature'||!s.trimmers)return;s.raw[p.t]+=4;s.harvested++;s.plants[a]=null;startWork('Harvesting '+STRAINS[p.t].name+'…',2);toast('4 harvested units. Bring them to the worktable.');}
if(k==='make'){if(!s.room||!s.raw[a])return;s.raw[a]--;s.gummies[a]++;s.made++;startWork('Shaping one '+STRAINS[a].name+' gummy…',Math.max(.6,2.2-s.bench*.4));}
if(k==='pack'){if(!s.room||!s.packStation||!s.gummies[a]||!s.wrappers)return;s.gummies[a]--;s.wrappers--;s.packs[a]++;startWork('Wrapping one '+STRAINS[a].name+' gummy…',Math.max(.5,1.6-s.bench*.3));toast('Packed. You can list it on your phone.');}
if(k==='list'){if(!Number.isInteger(a)||!STRAINS[a]||!Number.isInteger(b)||b<1||b>40||s.packs[a]<b||!Number.isFinite(c)||c<1||c>9999)return;s.listing={t:a,qty:b,price:Math.round(c)};s.listed++;toast('Listing saved. Now text a customer.');refresh('phone');}
if(k==='text'){if(!s.listing||!CONTACTS[a]||s.deals.some(d=>d.npc===a))return;let l=s.listing;const reserved=reservedQty(l.t);if(s.packs[l.t]-reserved<l.qty){toast('Not enough unreserved packs. Complete your agreed deals or lower listing quantity.');return}let max=Math.round(value(l.t)*CONTACTS[a].budget),thread={t:l.t,qty:l.qty,max,counter:Math.round(max*.9),status:'negotiating',messages:[],lastSale:readCustomerReceipt(s.threads[a],STRAINS.length)};s.threads[a]=thread;s.texted++;thread.messages.push({mine:true,text:`Hey, I’ve got ${l.qty} ${STRAINS[l.t].name} gummies. Asking $${l.price} each. Interested?`});if(l.price<=max)agree(a,l.price);else{thread.messages.push({mine:false,text:customerReply(a,'counter',thread.counter)})}refresh('thread',a);}
if(k==='offer'){let t=s.threads[a];if(!t||t.status!=='negotiating'||!Number.isFinite(b)||b<1||b>9999)return;b=Math.round(b);t.messages.push({mine:true,text:`How about $${b} each for ${t.qty}?`});if(b<=t.max){if(s.packs[t.t]-reservedQty(t.t)<t.qty){t.messages.push({mine:false,text:'Looks like you have that stock promised elsewhere. Text me when it’s available.'});t.status='closed';}else agree(a,b)}else{t.counter=Math.min(t.max,t.counter+Math.max(1,Math.round((t.max-t.counter)*.6)));t.messages.push({mine:false,text:`I can stretch to $${t.counter} each. Anything higher won’t work for me.`})}refresh('thread',a);}
if(k==='deliver'){let d=s.deals.find(d=>d.npc===a),customer=CONTACTS[a];if(!d||!customer||s.packs[d.t]<d.qty||!customerExchangeStatus(a).ok)return;s.packs[d.t]-=d.qty;let pay=d.price*d.qty;s.cash+=pay;s.earned+=pay;s.sold+=d.qty;s.xp+=d.qty*5;s.heat=Math.min(100,s.heat+12+d.qty*2);s.deals=s.deals.filter(o=>o!==d);s.threads[a].status='sold';s.threads[a].lastSale={t:d.t,qty:d.qty,total:pay,day:s.day,time:s.time};s.threads[a].messages.push({mine:false,text:customerReply(a,'thanks',pay)});track=null;close();toast('Sale complete · '+cash(pay)+' · +'+d.qty*5+' XP');committedExchange('deliver',a,d.t,d.qty);}
if(k==='lights'){if(level()<2||s.lights>=3||!spend(180+s.lights*170))return;s.lights++;refresh('hardware');toast('Better lights installed');}
if(k==='bench'){if(level()<2||s.bench>=3||!spend(220+s.bench*200))return;s.bench++;refresh('hardware');toast('Gummy press upgraded');}
if(k==='irrigation'){if(level()<3||s.irrigation||!s.can||!spend(450))return;s.irrigation=true;refresh('hardware');toast('Automatic watering installed');}
if(k==='hire'){let cfg={gardener:[2,300],crafter:[4,900],seller:[5,1300]}[a];if(!cfg||level()<cfg[0]||s.helpers[a]||!spend(cfg[1]))return;s.helpers[a]=true;s.hired++;refresh('helpers');toast('Helper hired. Keep supplies in stock.');}
if(k==='house'){const moved=commitWorkshopMove(s,a,STRAINS.length);if(!moved.ok){toast(moved.reason);return;}record('Property deed · '+WORKSHOP_NAMES[s.house],-moved.cost);handleWorkshopRelocation(moved.from);refresh('property');toast(WORKSHOP_NAMES[s.house]+' is ready. Crops and stock moved safely; use the workshop guide for your new stations.');}
if(k==='deposit'){if(s.laundry||![50,150,400,1000].includes(a)||s.cash<a)return;s.cash-=a;s.laundry={pay:Math.round(a*(s.front?.95:.9)),end:Date.now()+25000};refresh('laundry');toast('Deposit pending');}
if(k==='withdraw'){if(!s.laundry||Date.now()<s.laundry.end)return;s.bank+=s.laundry.pay;s.laundered+=s.laundry.pay;s.laundry=null;refresh('laundry');toast('Clean funds added to bank');}
if(k==='front'){if(s.front||level()<4||!spend(1500,true))return;s.front=true;refresh('laundry');toast('Suds is yours. Lower banking fees unlocked.');}
if(k==='sleep'){if(!s.room||!spend(15))return;s.day++;s.time=480;s.heat=0;stamina=100;for(let p of s.plants)if(p?.phase==='growing')p.end=Date.now()-1;if(s.laundry)s.laundry.end=Date.now()-1;close();toast('Morning in the bay. Rent paid.');}
if(k==='job'){if(!s.job){s.job=Date.now()+40000;toast('Reception shift started. Return in 40 seconds.')}else if(Date.now()>=s.job){s.bank+=35;s.job=null;toast('Reception shift paid · +$35 bank')}refresh('reception');}
save();}
function reservedQty(t){return s.deals.filter(d=>d.t===t).reduce((n,d)=>n+d.qty,0)}
function agree(i,price){let t=s.threads[i];t.status='agreed';t.messages.push({mine:false,text:customerReply(i,'agree',price,t.qty)});s.deals.push({npc:i,t:t.t,qty:t.qty,price});}
function action(k,a,b,c){if(!active||work)return;if(['deliver','sample'].includes(k)&&!customerExchangeStatus(a).ok){toast(customerExchangeStatus(a).reason);return;}if(net.role==='guest'){netSend({type:'action',k,a,b,c,x:player.x,z:player.z});if(['install','prepare','plant','water','make','pack','harvest','fill'].includes(k))startWork('Working together…',1.8,k==='water'||k==='fill');else toast('Sent to host');return}doAction(k,a,b,c);}
function noteLocationVisit(point){const key=locationKeyForType(point?.type);if(!key)return;if(net.role==='guest')netSend({type:'action',k:'visitPlace',a:key,x:player.x,z:player.z});else if(recordLocationVisit(s.visits,key,s.day,s.time).changed)save();}
function act(){if(!active||panel||work||!near)return;if(!Number.isFinite(focusScore(near,player,yaw))){near=null;return;}if(physicalPointTypes.has(near.type)&&!pointApproach(player,near,blocked,floorHeight,3)){toast('Move to a clear approach before interacting.');return;}if(near.type==='customer'&&!customerExchangeStatus(near.i).ok){toast(customerExchangeStatus(near.i).reason);return;}noteLocationVisit(near);if(near.type==='tent'){if(near.i>=s.tents)return;menu('tent',near.i)}else menu(near.type,near.i);}
let helperTimer=0,sellerTimer=0;function production(dt){for(let p of s.plants){if(p?.phase==='growing'&&Date.now()>=p.end)p.phase=p.waterings>=2?'mature':'thirsty';if(p&&['dry','thirsty'].includes(p.phase)&&(s.irrigation||(s.helpers.gardener&&s.workerEnabled.gardener))){p.waterings++;p.phase='growing';p.start=Date.now();p.end=Date.now()+STRAINS[p.t].time*(1-s.lights*.15)*500;s.watered++;}}
helperTimer+=dt;sellerTimer+=dt;if(helperTimer>4){helperTimer=0;if(s.helpers.gardener&&s.workerEnabled.gardener){for(let i of s.installed||[]){let p=s.plants[i];if(p?.phase==='mature'){s.raw[p.t]+=4;s.harvested++;s.plants[i]=null;}if(!s.plants[i]&&s.soil>0){let t=s.seeds.findIndex((n,t)=>n>0&&unlocked(t));if(t>=0){s.soil--;s.seeds[t]--;s.plants[i]={phase:'dry',t,waterings:0};s.planted++;}}}}
if(s.helpers.crafter&&s.workerEnabled.crafter&&s.packStation){for(let i=0;i<STRAINS.length;i++){if(s.raw[i]){s.raw[i]--;s.gummies[i]++;s.made++;}if(s.gummies[i]&&s.wrappers){s.gummies[i]--;s.wrappers--;s.packs[i]++;}}}}
if(sellerTimer>22){sellerTimer=0;if(s.helpers.seller&&s.workerEnabled.seller){let t=s.packs.findIndex((n,t)=>n>reservedQty(t));if(t>=0){s.packs[t]--;let pay=Math.round(value(t)*.9);s.cash+=pay;s.earned+=pay;s.sold++;s.xp+=5;toast('Sales assistant sold one '+STRAINS[t].name+' · '+cash(pay));}}}}
// Optional real peer-to-peer co-op. Host owns the save; the guest never overwrites local slots.
const net={role:'solo',pc:null,ch:null,offer:'',answer:'',status:'',remote:null,sendAt:0,connected:false};let other=null;
function netSend(data){if(net.ch?.readyState==='open')try{net.ch.send(JSON.stringify(data))}catch(e){}}
function encode(v){return btoa(JSON.stringify(v))}function decode(v){return JSON.parse(atob(v.trim()))}
function networkHTML(which){let tag='<div class="overline">OPTIONAL / TWO-PLAYER CO-OP</div>';if(which==='network')return tag+'<h2>A friend in the bay.</h2><p>Share the host’s world, money, stock and helpers, with a separate character each. The host keeps the save. Your friend’s local saves stay untouched.</p><p>Peer-to-peer connection: exchange an invite and a reply code. Both browsers must stay open. Some restricted networks require a relay server, which this version does not provide. Friends also need access to this private Site through its sharing controls.</p>'+row('Host your current save','Send an invite code, then paste your friend’s reply.','Host','hostCoop()',net.role!=='solo')+row('Join a friend','Paste their invite code, then send your reply back.','Join',"menu('join')")+(net.role!=='solo'?row('Current session',net.role+' · '+esc(net.status),'Disconnect','leaveCoop()'):'');
if(which==='host')return tag+'<h2>Invite one friend.</h2><p>1. Send your friend this invite code. They open this game → Join multiplayer → paste it.<br>2. They generate a reply code and send it back.<br>3. Paste their reply below and connect.</p><textarea id="inviteOut" readonly>'+esc(net.offer||'Gathering connection details…')+'</textarea><button class="ghost" onclick="copyCode(\'inviteOut\')">Copy invite</button><h3>Your friend’s reply</h3><textarea id="replyIn" placeholder="Paste their reply code"></textarea><button class="primary" onclick="acceptReply()">Connect friend</button><p id="netStatus" class="note">'+esc(net.status)+'</p>';
return tag+'<h2>Join a friend’s world.</h2><p>Paste the host’s invite, generate a reply, then send that reply back. Your own saves are preserved. One host and one guest.</p><textarea id="inviteIn" placeholder="Paste the host’s invite code"></textarea><button class="primary" onclick="joinCoop()">Generate reply</button>'+(net.answer?'<h3>Send this back to the host</h3><textarea id="answerOut" readonly>'+esc(net.answer)+'</textarea><button class="ghost" onclick="copyCode(\'answerOut\')">Copy reply</button>':'')+'<p id="netStatus" class="note">'+esc(net.status)+'</p>';}
async function gather(pc){if(pc.iceGatheringState==='complete')return;await new Promise(resolve=>{let timeout=setTimeout(resolve,9000);function change(){if(pc.iceGatheringState==='complete'){clearTimeout(timeout);pc.removeEventListener('icegatheringstatechange',change);resolve()}}pc.addEventListener('icegatheringstatechange',change)})}
function newPeer(role){if(!window.RTCPeerConnection)throw Error('This browser does not support peer-to-peer multiplayer.');net.role=role;net.pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun.cloudflare.com:3478'}]});net.pc.onconnectionstatechange=()=>{net.status=net.pc?.connectionState||'closed';if(['failed','disconnected'].includes(net.status)){toast('Co-op connection '+net.status+'. Open Menu → Multiplayer to reconnect.');net.connected=false;}};net.pc.ondatachannel=e=>wireChannel(e.channel);return net.pc;}
function wireChannel(ch){net.ch=ch;ch.onopen=()=>{net.connected=true;net.status='connected';if(net.role==='host'){netSend({type:'welcome',state:s,mode});close();toast('Friend connected. You share the business.')}else toast('Connected to host');};ch.onclose=()=>{net.connected=false;net.status='connection closed';if(other)other.visible=false;toast('Co-op disconnected. The host keeps the save.');};ch.onmessage=e=>{try{let msg=JSON.parse(e.data);if(msg.type==='welcome'&&net.role==='guest'){if(!msg.state||msg.state.version!==3)return;s=normalize(msg.state);mode=msg.mode;active=true;close();player.set(-52,1.72,32);yaw=-Math.PI/2;pitch=0;stamina=100;resetPlayerView();toast('Joined shared world. Your own save slots remain unchanged.');}
if(msg.type==='state'&&net.role==='guest'){s=normalize(msg.state);net.remote=msg.player;}
if(msg.type==='position'&&net.role==='host')net.remote=msg.player;
if(msg.type==='toast')toast(String(msg.msg).slice(0,220));
if(msg.type==='action'&&net.role==='host'&&net.connected){if(!ACTION_NAMES.includes(msg.k)||!Number.isFinite(msg.x)||!Number.isFinite(msg.z)||msg.x<WORLD.minX||msg.x>WORLD.maxX||msg.z<WORLD.minZ||msg.z>WORLD.maxZ)return;let backup=player.clone();player.set(msg.x,Number.isFinite(net.remote?.y)?net.remote.y:1.72+floorHeight(msg.x,msg.z),msg.z);processingRemote=true;try{doAction(msg.k,msg.a,msg.b,msg.c)}finally{processingRemote=false;player.copy(backup)}save();netSend({type:'state',state:s,player:playerPacket()});}
}catch(error){toast('Invalid co-op update ignored')}};}
async function hostCoop(){if(!active||net.role!=='solo')return;save();try{let pc=newPeer('host');wireChannel(pc.createDataChannel('gummy-bay'));net.status='Preparing invite…';menu('host');await pc.setLocalDescription(await pc.createOffer());await gather(pc);net.offer=encode(pc.localDescription);net.status='Invite ready. Waiting for a reply.';menu('host')}catch(e){net.status=e.message;toast(e.message);menu('network')}}
async function joinCoop(){let invite=$('inviteIn')?.value;if(!invite)return;let offer;try{offer=decode(invite);if(offer.type!=='offer'||typeof offer.sdp!=='string')throw Error()}catch(e){toast('That is not a valid invite code.');return}if(active)save();disconnect(false);try{let pc=newPeer('guest');net.status='Preparing reply…';await pc.setRemoteDescription(offer);await pc.setLocalDescription(await pc.createAnswer());await gather(pc);net.answer=encode(pc.localDescription);net.status='Reply ready. Send it to the host, then keep this tab open.';menu('join');}catch(e){net.status=e.message;toast('Could not connect: '+e.message);menu('join')}}
async function acceptReply(){try{let answer=decode($('replyIn').value);if(answer.type!=='answer')throw Error('Expected a reply code.');await net.pc.setRemoteDescription(answer);net.status='Connecting…';$('netStatus').textContent=net.status;}catch(e){toast('Could not use reply: '+e.message)}}
function disconnect(show=true){clearExchangeGesture();if(active&&net.role==='host')save();let guest=net.role==='guest';net.ch?.close();net.pc?.close();Object.assign(net,{role:'solo',pc:null,ch:null,offer:'',answer:'',status:'',remote:null,connected:false});if(other)other.visible=false;if(guest)active=false;if(show){if(active)menu('pause');else menu('title');toast('Co-op disconnected. Local saves preserved.')}}
function playerPacket(){return {x:player.x,y:player.y,z:player.z,yaw,pitch,worker:net.role==='host'?{x:crafterActor.position.x,z:crafterActor.position.z,angle:crafterActor.rotation.y,visible:crafterActor.visible,carrying:!!s.crafterCargo,status:physicalCrafter.status}:null}}
function networkTick(dt){net.sendAt+=dt;if(net.sendAt<.35||!net.connected)return;net.sendAt=0;if(net.role==='host')netSend({type:'state',state:s,player:playerPacket()});else if(net.role==='guest')netSend({type:'position',player:playerPacket()});if(net.remote){if(!other)other=bobble(0,0,0x76a9aa,0xd3ac87,0x67513c);other.visible=true;other.position.set(net.remote.x,floorHeight(net.remote.x,net.remote.z),net.remote.z);other.rotation.y=net.remote.yaw+Math.PI;other.userData.head.rotation.z=Math.sin(now*3)*.04;}}
async function copyCode(id){try{await navigator.clipboard.writeText($(id).value);toast('Code copied')}catch(e){$(id).focus();$(id).select();toast('Select and copy the highlighted code.')}}
const ACTION_NAMES=['call','rent','buyTent','buyCan','seed','soil','wrappers','lemonade','install','prepare','plant','fill','water','harvest','make','pack','list','text','offer','deliver','lights','bench','irrigation','hire','house','deposit','withdraw','front','sleep','job','visitPlace'];
function exportSave(){if(!active)return;save();let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({format:'gummybay',version:3,state:s},null,2)],{type:'application/json'}));a.download='gummybay-'+mode+'-'+slot+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importSave(){if(net.role!=='solo'){toast('Disconnect co-op before importing a save.');return}let input=document.createElement('input');input.type='file';input.accept='.json';input.onchange=async()=>{try{let f=input.files[0];if(!f)return;if(f.size>500000)throw Error();let o=JSON.parse(await f.text()),v=o.state;if(o.format!=='gummybay'||v?.version!==3||!['story','free'].includes(v.mode)||!['cash','bank','xp','x','z'].every(k=>Number.isFinite(v[k]))||!['seeds','raw','gummies','packs'].every(k=>Array.isArray(v[k])&&v[k].length>=6&&v[k].length<=STRAINS.length&&v[k].every(n=>Number.isFinite(n)&&n>=0))||!Array.isArray(v.plants)||v.plants.length>8||!Array.isArray(v.deals)||typeof v.threads!=='object')throw Error();pendingReset=o;menu('importConfirm')}catch(e){toast('That is not a valid Gummy Bay save.')}};input.click()}
function confirmImport(){if(!pendingReset)return;s={...fresh(pendingReset.state.mode),...normalize(pendingReset.state)};normalize(s);mode=s.mode;pendingReset=null;player.set(s.x,1.72,s.z);yaw=s.yaw||0;pitch=s.pitch||0;active=true;settleSpawn();reconcileJourney(false,false);save();close();toast('Save restored into '+mode+' slot '+slot)}
// Production physically relocates when a better property is purchased.
function productionFurniture(x,z,home){box(x+7,.6,z+3,4,1.2,1.25,0xb59b71,true);box(x+7,1.25,z+3,4.2,.12,1.4,0xe6cfa1);rounded(x+6,1.5,z+3,.8,.35,.7,0xa8b98b);cyl(x+8,1.5,z+3,.35,.35,0xe1c291);addPoint('craft','Gummy-making table',x+7,z+5,{home});box(x+7,.65,z-5,3.3,1.3,1.1,0xabc0b4,true);rounded(x+7,1.35,z-5,2.4,.15,.8,0xf0ede0);cyl(x+7,1.6,z-5,.04,.4,0x8b9d97);addPoint('sink','Sink · Fill watering can',x+7,z-3,{home});}
productionFurniture(-54,55,1);productionFurniture(54,51,2);
const tentOrigins=[{x:-31,z:35},{x:-61,z:49},{x:47,z:45}];
for(let p of points)if((p.type==='craft'||p.type==='sink')&&p.home===undefined)p.home=0;
function pointVisible(p){if(p.type==='tent')return p.i<s.tents;if(p.type==='craft'||p.type==='sink')return (p.home||0)===s.house;return true}
function refreshBase(){let origin=tentOrigins[s.house];tents.forEach((g,i)=>{g.position.set(origin.x+(i%4)*3.3,0,origin.z+Math.floor(i/4)*5.8);let p=points.find(p=>p.type==='tent'&&p.i===i);p.x=g.position.x;p.z=g.position.z+1.6});}
trackPlace=function(type){let p=points.find(p=>p.type===type&&pointVisible(p))||points.find(p=>p.type===type);if(!p)return;track={x:p.x,z:p.z,label:p.label};close();toast('Tracking '+p.label)};
const map=$('map'),mc=map.getContext('2d');function drawMap(){mc.fillStyle='#92af81';mc.fillRect(0,0,334,288);const scale=1.65,ox=167,oz=142;const pos=(x,z)=>[ox+x*scale,oz+z*scale];mc.fillStyle='#b2cfc5';mc.fillRect(0,265,334,40);mc.fillStyle='#7e8c7d';mc.fillRect(0,oz-8,334,16);mc.fillRect(ox-8,0,16,275);const places=[[-58,26,'R','#d4c294'],[-47,29,'P','#628c7a'],[-25,19,'M','#c28d72'],[-24,-23,'H','#7c9ea2'],[25,22,'S','#7f9f67'],[24,-25,'C','#c39272'],[53,22,'$','#75a6a6'],[54,-25,'L','#b29672'],[-53,-25,'A','#9888a4'],[-54,55,'W','#84a6a0'],[54,51,'B','#b5a178']];for(let [x,z,label,col]of places){let [a,b]=pos(x,z);mc.fillStyle=col;mc.fillRect(a-10,b-10,20,20);mc.fillStyle='#fff3cc';mc.textAlign='center';mc.font='bold 12px sans-serif';mc.fillText(label,a,b+4)}for(let [i,c]of CONTACTS.entries()){let [a,b]=pos(c.x,c.z);mc.fillStyle=s.deals.some(d=>d.npc===i)?'#ffe4a1':'#e4ce99';mc.beginPath();mc.arc(a,b,3.2,0,7);mc.fill()}if(track){let [a,b]=pos(track.x,track.z);mc.strokeStyle='#fff0b0';mc.lineWidth=2;mc.beginPath();mc.arc(a,b,8+Math.sin(now*3),0,7);mc.stroke()}let [a,b]=pos(player.x,player.z);mc.save();mc.translate(a,b);mc.rotate(-yaw);mc.fillStyle='#fff9df';mc.beginPath();mc.moveTo(0,-7);mc.lineTo(-4.5,5);mc.lineTo(4.5,5);mc.closePath();mc.fill();mc.restore();if(net.remote&&net.connected){let [a,b]=pos(net.remote.x,net.remote.z);mc.fillStyle='#81e2df';mc.beginPath();mc.arc(a,b,4,0,7);mc.fill()}}
function updateUI(){refreshBase();updateBusinessHUD();near=chooseInteraction(points,player,yaw,near,p=>pointVisible(p)&&(p.type!=='customer'||customerExchangeStatus(p.i).ok)&&(!physicalPointTypes.has(p.type)||pointApproach(player,p,blocked,floorHeight,3)));$('prompt').style.display=near&&active&&!panel&&!work?'block':'none';if(near){let label=near.label;if(near.type==='tent')label=tentTitle(near.i);$('prompt').innerHTML='<span class="key">E</span>'+label+'<small>'+(near.type==='customer'?'Meet / deliver agreed deals':'Interact')+'</small>'}$('cash').textContent=cash(s.cash);$('bank').textContent=cash(s.bank);$('level').textContent=(lp=>lp.need?lp.level+' · '+lp.into+'/'+lp.need:lp.level+' · MAX')(levelProgress(s.xp));$('clock').textContent=s.day+' / '+String(Math.floor(s.time/60)).padStart(2,'0')+':'+String(Math.floor(s.time%60)).padStart(2,'0');let heat=Math.min(5,Math.ceil(s.heat/20));$('heat').textContent='● '.repeat(heat)+'○ '.repeat(5-heat);$('heat').style.color=heat>=3?'#f1b17c':'#d8e5b8';$('saveLabel').textContent=net.role==='guest'?'GUEST · HOST’S SHARED WORLD':mode.toUpperCase()+' · SAVE '+slot;$('district').textContent=player.x<-40&&player.z>10?'Driftwood campsite':player.z>40?'Harbor neighbourhood':player.z<0?'Main Street':'Palm Court';$('stamina').style.width=stamina+'%';$('netbadge').textContent=net.role==='solo'?'':net.connected?'CO-OP · '+net.role.toUpperCase():'CO-OP · '+net.status;$('hint').textContent=active&&!panel&&document.pointerLockElement!==canvas?'Drag to look · aim at an object and press E · Esc for menu':'';
if(mode==='story'){const journey=reconcileJourney(true),chapter=STORY[Math.min(journey.chapter,STORY.length-1)];$('objective').innerHTML='<div class="overline">'+(journey.complete?'STORY COMPLETE · KEEP PLAYING':'GRAMPS’ NOTEBOOK · OPTIONAL')+'</div><h2>'+(journey.complete?'A sweet little empire':chapter.title)+'</h2><p>'+(journey.complete?'Your business is running itself. Keep expanding, exploring and negotiating in the same save.':chapter.text)+'</p><button class="trackbtn" onclick="trackObjective()">Track next step →</button>';}else $('objective').innerHTML='<div class="overline">FREE PLAY / YOUR OWN PACE</div><h2>Start small. Grow big.</h2><p>'+s.sold+' gummies sold · '+cash(s.earned)+' earned.<br>'+(s.room?'Room 04 rented':'No room rented yet')+' · '+s.tents+' tents<br>'+s.hired+' helpers · '+maxTents()+' tent capacity</p><button class="trackbtn" onclick="menu(\'journal\')">Open growing guide →</button>';
tents.forEach((g,i)=>{g.visible=i<s.tents&&s.installed?.includes(i);let p=s.plants[i],v=plantVisuals[i];v.visible=!!p&&p.phase!=='soil';if(v.visible){let f=p.phase==='mature'?1:p.phase==='thirsty'?.55:p.phase==='dry'?.12:Math.min(1,(p.waterings===1?.15:.55)+Math.max(0,(Date.now()-p.start)/(p.end-p.start))*.4);v.scale.setScalar(Math.max(.1,f));v.traverse(o=>{if(o.isMesh&&o.geometry.type==='SphereGeometry')o.material=mat(STRAINS[p.t].color)})}});beacon.visible=!!track;if(track)beacon.position.set(track.x,0,track.z);drawMap();}
function staticBlocked(x,z,ignored=null){if(x<WORLD.minX||x>WORLD.maxX||z<WORLD.minZ||z>WORLD.maxZ)return true;const hits=colliderCandidates(colliders,x,z);for(let i=0;i<hits.length;i++){const b=hits[i];if(Math.abs(x-b.x)<b.w/2&&Math.abs(z-b.z)<b.d/2&&!ignored?.has(b)&&(!b.furniture||colliderEnabled(b)))return true;}return false;}

function activeTentPose(i){
 if(!active||!s.room||!Number.isInteger(i)||i<0||i>=Math.min(8,s.tents,maxTents())||!s.installed?.includes(i))return null;
 const p=s.layout?.[s.house+':'+i],o=tentOrigins[s.house];
 return {x:Number.isFinite(p?.x)?p.x:o.x+(i%4)*3.3,z:Number.isFinite(p?.z)?p.z:o.z+Math.floor(i/4)*5.8,r:Number.isFinite(p?.r)?p.r:0};
}
function tentCollisionAt(x,z,ignored=null){
 if(!active||!s.room)return false;
 const origin=tentOrigins[s.house],limit=Math.min(8,s.tents,maxTents());
 for(let i=0;i<limit;i++){
  if(ignored?.has(i)||!s.installed?.includes(i))continue;
  const p=s.layout?.[s.house+':'+i],tx=Number.isFinite(p?.x)?p.x:origin.x+(i%4)*3.3,tz=Number.isFinite(p?.z)?p.z:origin.z+Math.floor(i/4)*5.8;
  if(tentPointBlocked(x,z,tx,tz,Number.isFinite(p?.r)?p.r:0))return true;
 }
 return false;
}
function blocked(x,z,ignored=null){return staticBlocked(x,z,ignored)||tentCollisionAt(x,z,ignored);}
// Static collider records already carry the .325 player padding. Keep player,
// worker and placement routes unchanged; add only the measured crate excess.
function propStaticBlocked(x,z){
 if(x<WORLD.minX+PROP_HALF_WIDTH||x>WORLD.maxX-PROP_HALF_WIDTH||z<WORLD.minZ+PROP_HALF_DEPTH||z>WORLD.maxZ-PROP_HALF_DEPTH)return true;
 const extraX=Math.max(0,PROP_HALF_WIDTH-.325),extraZ=Math.max(0,PROP_HALF_DEPTH-.325);
 return colliders.some(b=>Math.abs(x-b.x)<b.w/2+extraX&&Math.abs(z-b.z)<b.d/2+extraZ&&(!b.furniture||colliderEnabled(b)));
}
function propTentCollisionAt(x,z){
 for(let i=0;i<8;i++){const p=activeTentPose(i);if(p&&tentPropBlocked(x,z,p.x,p.z,p.r))return true;}
 return false;
}
function propBlocked(x,z){return propStaticBlocked(x,z)||propTentCollisionAt(x,z);}
function recoverTentPlayer(){
 if(!active||driving)return false;
 const enclosing=new Set();
 for(let i=0;i<8;i++){const p=activeTentPose(i);if(p&&tentPointBlocked(player.x,player.z,p.x,p.z,p.r))enclosing.add(i);}
 if(!enclosing.size)return false;
 const safe=escapeEnclosure(player,enclosing,blocked);if(!safe)return false;
 player.x=safe.x;player.z=safe.z;return true;
}

const locomotion={x:0,z:0,jump:0,vertical:0,crouch:0,space:false,jumpQueued:0,coyote:.1,airSpeed:0,regenWait:0,dip:0,stepEye:0,lastGround:null};let catchCooldown=0;function update(dt){if(!active||panel)return;if(net.role==='guest'&&!net.connected)return;if(net.role!=='guest'&&!ensurePolice().search)production(dt);let turning=(keys.arrowleft?1:0)-(keys.arrowright?1:0);yaw+=turning*dt*1.55;let dx=(keys.d?1:0)-(keys.a?1:0),dz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);if(work)dx=dz=0;walk=!!(dx||dz);const wish=wishAxes(dx,dz),len=Math.hypot(wish.dx,wish.dz)||1,crouched=!!keys.control||!playerHeadFits({ground:floorHeight(player.x,player.z),ceiling:ceilingHeight(player.x,player.z)}),running=keys.shift&&walk&&stamina>2&&!crouched,v=groundSpeed({crouching:crouched,sprinting:running}),airborneNow=locomotion.jump>0.001;
let tx=(wish.dx*Math.cos(yaw)+wish.dz*Math.sin(yaw))/len*v,tz=(-wish.dx*Math.sin(yaw)+wish.dz*Math.cos(yaw))/len*v;if(airborneNow){const capped=capAirWish(tx,tz,locomotion.airSpeed);tx=capped.tx;tz=capped.tz;}
const response=moveResponse(walk,airborneNow,running),travelX=dampedTravel(locomotion.x,tx,dt,response),travelZ=dampedTravel(locomotion.z,tz,dt,response),beforeX=player.x,beforeZ=player.z;locomotion.x=travelX.velocity;locomotion.z=travelZ.velocity;
const step=slideMotion(player,travelX.distance,travelZ.distance,(x,z)=>blocked(x,z)||!playerHeadFits({ground:floorHeight(x,z),crouch:locomotion.crouch,jump:locomotion.jump,ceiling:ceilingHeight(x,z)})||riseTooSteep(floorHeight(player.x,player.z),floorHeight(x,z),locomotion.jump>0));player.x=step.x;player.z=step.z;if(step.hitX)locomotion.x=0;if(step.hitZ)locomotion.z=0;
const supportBefore=groundSupport(beforeX,beforeZ,floorHeight),supportAfter=groundSupport(player.x,player.z,floorHeight),push=slopePush(supportBefore,supportAfter,player.x-beforeX,player.z-beforeZ);if(locomotion.jump===0){locomotion.x+=push.x*Math.max(0,Math.min(.1,dt));locomotion.z+=push.z*Math.max(0,Math.min(.1,dt));}
const canJump=canJumpNow(locomotion.jump,locomotion.vertical,locomotion.coyote),jumpInput=bufferedJump(locomotion.jumpQueued,!!keys[' ']&&!locomotion.space,canJump,!crouched&&!work,dt);locomotion.jumpQueued=jumpInput.queued;const releasing=!!locomotion.space&&!keys[' '];if(jumpInput.launch){locomotion.vertical=JUMP_LAUNCH;locomotion.airSpeed=Math.hypot(locomotion.x,locomotion.z);locomotion.coyote=0;}else{const drop=cliffDrop(supportBefore,supportAfter,locomotion.jump);if(drop){locomotion.jump=drop;locomotion.vertical=Math.min(0,locomotion.vertical);locomotion.airSpeed=Math.hypot(locomotion.x,locomotion.z);}}
locomotion.vertical=cutJump(locomotion.vertical,releasing);const impact=locomotion.vertical,airborne=jumpStep(locomotion.jump,locomotion.vertical,dt,verticalGravity(locomotion.vertical));if(locomotion.jump>0&&airborne.height===0)locomotion.dip=landingDip(impact);locomotion.jump=airborne.height;locomotion.vertical=clampFall(airborne.velocity);locomotion.coyote=coyoteLeft(locomotion.coyote,locomotion.jump===0,dt);locomotion.space=!!keys[' '];
locomotion.crouch=crouchStep(locomotion.crouch,!!keys.control,floorHeight(player.x,player.z),ceilingHeight(player.x,player.z),dt);const travelled=Math.hypot(player.x-beforeX,player.z-beforeZ);walk=travelled>.0001;const staminaNext=staminaStep(stamina,running&&walk,locomotion.regenWait,dt,{jumping:jumpInput.launch});stamina=staminaNext.stamina;locomotion.regenWait=staminaNext.wait;walkPhase+=dt*(running?2.6:1.8)*Math.PI*2;locomotion.dip=decayDip(locomotion.dip,dt);
{const g=floorHeight(player.x,player.z);locomotion.stepEye=stepEyeOffset(locomotion.stepEye,locomotion.lastGround==null?0:g-locomotion.lastGround,dt,{grounded:locomotion.jump===0,driving});locomotion.lastGround=g;}
syncPlayerView();
camera.fov+=((running&&walk&&comfort.sprintFov?Math.min(100,fovBase+5):fovBase)-camera.fov)*(1-Math.exp(-dt*FOV_RESPONSE));camera.updateProjectionMatrix();camera.rotation.set(pitch,yaw,locomotion.roll||0);hand.position.y=comfort.bob&&walk?Math.sin(walkPhase)*.012:0;updateChunkyPlayerHand(playerHand,{walking:walk,phase:walkPhase,now,offering:panel==='customer'});watering.rotation.z=work?Math.sin(now*4)*.15:0;
if(net.role!=='guest'){const wasCurfew=curfewActive(s.time);s.time+=dt*1.2;if(s.time>=1440){s.time-=1440;s.day++}const nowCurfew=curfewActive(s.time);if(nowCurfew!==wasCurfew)emitGameplay({type:'curfew',active:nowCurfew,day:s.day,time:s.time});if(!nowCurfew)s.heat=Math.max(0,s.heat-dt*.9);catchCooldown=Math.max(0,catchCooldown-dt);}
people.forEach((g,i)=>{if(Math.hypot(g.position.x-player.x,g.position.z-player.z)<5){const desired=Math.atan2(player.x-g.position.x,player.z-g.position.z),delta=Math.atan2(Math.sin(desired-g.rotation.y),Math.cos(desired-g.rotation.y));g.rotation.y+=delta*(1-Math.exp(-dt*5));}g.userData.head.rotation.z=Math.sin(now*1.7+i)*.015});if(track&&!Number.isInteger(track.npc)&&Math.hypot(player.x-track.x,player.z-track.z)<2.3)track=null;
// Environmental state is projected once before rendering, including paused menus.
}
let streetShot=false,shotHour=null,shotKind='starter',shotCam=null;const streetShotFrames=[];
const simStepper=createFixedStepper({maxFrame:1});function frame(t){const real=last?Math.max(0,(t-last)/1000):0;last=t;const steps=simStepper.consume(real);const sim=steps.reduce((sum,step)=>sum+step,0);now+=sim;const streetShotStart=streetShot?performance.now():0;for(const step of steps)updateStationInput(step);if(work){let f=(performance.now()-work.start)/(work.seconds*1000);$('workProgress').style.width=Math.min(100,f*100)+'%';if(f>=1){work=null;$('work').style.display='none';watering.visible=false;save()}}for(const step of steps)update(step);if(streetShot){if(shotHour!=null)s.time=shotHour*60;if(shotKind==='opening'){const pose=openingCamera(.25);camera.position.set(pose.x,pose.y,pose.z);camera.lookAt(pose.lookX,pose.lookY,pose.lookZ);}else if(shotKind==='city'&&shotCam){camera.position.set(shotCam[0],shotCam[1],shotCam[2]);camera.lookAt(shotCam[3],shotCam[4],shotCam[5]);}else{camera.position.set(16,11.5,46);camera.lookAt(-36,2.2,18);}}else if(!active){if(cine.flyover)cineFlyoverCamera();else{camera.position.set(-43+Math.sin(now*.04),4.3,39);camera.lookAt(-57,1.5,25.5);}}cineTick();uiTimer+=sim;if(uiTimer>.14){uiTimer=0;if(active)updateUI()}saveTimer+=sim;if(saveTimer>5){saveTimer=0;save()}networkTick(sim);arrow.position.y=3.1+Math.sin(now*2.5)*.2;renderFrame();if(streetShot){streetShotFrames.push(performance.now()-streetShotStart);if(streetShotFrames.length>180)streetShotFrames.shift();}requestAnimationFrame(frame)}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);resizeEffects()});let drag=false,touchLast=null;canvas.addEventListener('mouseenter',()=>mouseInside=true);canvas.addEventListener('mouseleave',()=>mouseInside=false);canvas.addEventListener('pointerdown',e=>{if(active&&!panel&&e.pointerType!=='touch'&&e.button===0){drag=true;canvas.setPointerCapture?.(e.pointerId)}});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);addEventListener('mousemove',e=>{if(active&&!panel&&(document.pointerLockElement===canvas||(drag&&e.target===canvas))){mouseInside=true;mouseX=e.clientX;mouseY=e.clientY;let dx=Math.max(-80,Math.min(80,e.movementX||0)),dy=Math.max(-80,Math.min(80,e.movementY||0));yaw-=dx*lookSensitivity;pitch=Math.max(-PITCH_LIMIT,Math.min(PITCH_LIMIT,pitch-dy*lookSensitivity))}});canvas.addEventListener('touchstart',e=>{if(e.touches[0])touchLast={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});canvas.addEventListener('touchmove',e=>{if(panel||!touchLast)return;let t=e.touches[0];yaw-=(t.clientX-touchLast.x)*.004;pitch=Math.max(-PITCH_LIMIT,Math.min(PITCH_LIMIT,pitch-(t.clientY-touchLast.y)*.004));touchLast={x:t.clientX,y:t.clientY};e.preventDefault()},{passive:false});canvas.addEventListener('touchend',()=>touchLast=null);
addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&e.key!=='Escape')return;let k=e.key.toLowerCase();if(['tab','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();if(!active)return;if(k==='escape'){panel?close():menu('pause');return}if(['e','t','tab','j','m','i'].includes(k)&&e.repeat)return;if(k==='e'){act();return}if(['t','tab','j','m','i'].includes(k)){if(work)return;panel?close():k==='tab'?phoneHome():menu({t:'phone',j:'journal',m:'map',i:'bag'}[k]);return}if(!panel)keys[k]=true});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>{keys={};drag=false;save()});document.addEventListener('visibilitychange',()=>{keys={};save();last=0});window.addEventListener('pagehide',save);document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys[b.dataset.key]=true};b.onpointerup=b.onpointercancel=()=>keys[b.dataset.key]=false});
// v144 playtest: phones had no way to press E (sticky-net mash, interact). The USE button replays a real E keypress through the same listeners.
document.querySelectorAll('[data-tap]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();dispatchEvent(new KeyboardEvent('keydown',{key:b.dataset.tap,bubbles:true}));setTimeout(()=>dispatchEvent(new KeyboardEvent('keyup',{key:b.dataset.tap,bubbles:true})),60)}});
Object.assign(window,{menu,slots,loadGame:load,closeMenu:close,action,act,trackPlace,trackCustomer,trackObjective,title,manualSave:()=>{save();toast(net.role==='guest'?'The host saves this shared world.':'Saved '+mode+' slot '+slot)},exportSave,importSave,confirmImport,modeName:()=>mode,slotNumber:()=>slot,hostCoop,joinCoop,acceptReply,copyCode,leaveCoop:()=>disconnect(true)});
// Gummy Bay 4: small-town street dressing, physical mixing, ATMs, and recycling.
const camperGlow=new THREE.PointLight(0xe7ad7c,5,9,2);camperGlow.position.set(-58,2.6,26);scene.add(camperGlow);
let mouseInside=false,mouseX=innerWidth/2,mouseY=innerHeight/2,lookSensitivity=LOOK_SENSITIVITY,fovBase=FOV_BASE,bobAmount=BOB_AMOUNT;
let storyCastVisible=()=>false;let effects=null,quality='balanced',appliedQuality=null,appliedPixelRatio=null,districtArchitecture=null,streetConstruction=null,verticalTown=null,contextualStreetProps=null,districtHorizon=null,townSkyline=null,junctionReveals=null,townUtilities=null,overheadInfrastructure=null,townFencing=null,foregroundDepth=null,domesticWorkplace=null,doorwayReveals=null,windowConnections=null,ordinaryUnusualWork=null,publicServiceFronts=null,narrowAlleys=null,shopApproaches=null,logicalWear=null,productionContainers=null,occupationalOutfits=null,residentAccessories=null,residentFootSilhouettes=null,nightSilhouettes=null,scruffyWelcome=null,chunkyCast=null,streetCrowd=null,starterStreet=null;
try{lookSensitivity=Number(localStorage.getItem('gummybay-sensitivity'))||LOOK_SENSITIVITY;const storedFov=localStorage.getItem('gummybay-fov');if(storedFov!=null){const n=Number(storedFov);if(n>=60&&n<=100)fovBase=n;}const storedBob=localStorage.getItem('gummybay-bob');if(storedBob!=null){const n=Number(storedBob);if(n>=0&&n<=1)bobAmount=n;}camera.fov=fovBase;}catch(e){}
try{
 let saved=null,cores,saveData=false,coarse=false,software=false;
 try{saved=localStorage.getItem('gummybay-quality')}catch(e){}
 try{cores=navigator.hardwareConcurrency}catch(e){}
 try{saveData=!!navigator.connection?.saveData}catch(e){}
 try{coarse=!!matchMedia('(pointer:coarse)').matches}catch(e){}
 try{const gl=renderer.getContext(),info=gl.getExtension('WEBGL_debug_renderer_info');software=/swiftshader|llvmpipe|softpipe/i.test(info?gl.getParameter(info.UNMASKED_RENDERER_WEBGL):'')}catch(e){}
 quality=detectLookQuality({saved,cores,saveData,coarse,software});
}catch(e){quality='balanced'}
function resizeEffects(){if(effects)effects.resize(Math.min(innerWidth,1600),Math.min(innerHeight,1000))}
function setQuality(q){
 const preset=lookPreset(q);q=preset.quality;const ratio=Math.min(devicePixelRatio,preset.pixelRatio);
 if(appliedQuality===q&&appliedPixelRatio===ratio&&(q!=='high'||effects))return;
 quality=q;effects?.dispose();effects=null;renderer.shadowMap.enabled=q!=='performance';renderer.setPixelRatio(ratio);renderer.setSize(innerWidth,innerHeight);
 districtArchitecture?.setQuality(q);
 streetConstruction?.setQuality(q);
 starterStreet?.setQuality(q);
 verticalTown?.setQuality(q);
 contextualStreetProps?.setQuality(q);
 districtHorizon?.setQuality(q);
 townSkyline?.setQuality(q);
 junctionReveals?.setQuality(q);
 townUtilities?.setQuality(q);
 cityExpansion?.setQuality(q);
 overheadInfrastructure?.setQuality(q);
 townFencing?.setQuality(q);
 foregroundDepth?.setQuality(q);
 domesticWorkplace?.setQuality(q);
 doorwayReveals?.setQuality(q);
 windowConnections?.setQuality(q);
 ordinaryUnusualWork?.setQuality(q);
 publicServiceFronts?.setQuality(q);
 narrowAlleys?.setQuality(q);
 shopApproaches?.setQuality(q);
 logicalWear?.setQuality(q);
 setObjectSilhouetteQuality(scene,q);
 productionContainers?.setQuality(q);
 occupationalOutfits?.setQuality(q);
 residentAccessories?.setQuality(q);
 residentFootSilhouettes?.setQuality(q);
 chunkyCast?.setQuality(q);
 streetCrowd?.setQuality(q);
 nightSilhouettes?.setQuality(q);
 scruffyWelcome?.setQuality(q);
 if(q==='high')try{effects=createEffects(renderer,scene,camera,Math.min(innerWidth,1600),Math.min(innerHeight,1000))}catch(e){toast('Colour grade unavailable; the scene still draws directly.')}
 if(lookVignette)lookVignette.style.display=preset.vignette==='css'?'block':'none';
 appliedQuality=q;appliedPixelRatio=ratio;try{localStorage.setItem('gummybay-quality',q)}catch(e){}if(panel==='settings')menu('settings');
}
const lookVignette=document.createElement('div');lookVignette.id='lookVignette';lookVignette.style.cssText='pointer-events:none;position:fixed;inset:0;background:radial-gradient(ellipse at center, transparent 52%, rgba(8,12,18,.55) 100%);display:none;z-index:4';document.body.appendChild(lookVignette);
function renderFrame(){if(typeof visualPolish!=='undefined'){visualPolish.update({active,state:s,task:stationTask,held:stationHeld||stationAssist,now,near,quality,productColor:STRAINS[stationTask?.a]?.color});if(stationTask&&['mix','make','pack','prepare','water','fill'].includes(stationTask.k)){stationTool.visible=false;syrupStream.visible=false;stationPiece.visible=!['mix','make','pack'].includes(stationTask.k);stationWrapper.visible=false;}else{stationPiece.visible=true;stationWrapper.visible=true;}}if(panel==='arrival'&&cine.scene&&typeof introCameraPose==='function')introCameraPose();else if(panel==='arrival'){const pose=openingCamera(now-arrivalStarted);camera.position.set(pose.x,pose.y,pose.z);camera.lookAt(pose.lookX,pose.lookY,pose.lookZ);}if(effects)effects.render();else renderer.render(scene,camera)}
function record(label,amount){s.ledger??=[];s.ledger.unshift({label,amount,balance:s.bank,day:s.day});s.ledger=s.ledger.slice(0,16)}
function textured(kind){let c=document.createElement('canvas');c.width=c.height=256;let t=c.getContext('2d'),seed=31;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};let bases={brick:'#a48872',plaster:'#beb8a6',asphalt:'#59605d',concrete:'#aaa99a',gravel:'#a79e85',roof:'#696f66',wood:'#9a8061'};t.fillStyle=bases[kind];t.fillRect(0,0,256,256);
if(kind==='iron'){t.fillStyle='#858b85';t.fillRect(0,0,256,256);for(let x=0;x<256;x+=16){t.fillStyle='#535e5b';t.fillRect(x,0,3,256);t.fillStyle='#a0a69a';t.fillRect(x+3,0,2,256);}for(let i=0;i<22;i++){t.fillStyle='#79563d44';t.fillRect(rand()*256,rand()*256,2+rand()*7,12+rand()*60);}}
if(kind==='brick'){t.fillStyle='#aaa494';t.fillRect(0,0,256,256);for(let y=0;y<256;y+=24)for(let x=-32;x<256;x+=64){let xx=x+(y/24%2)*32;t.fillStyle=['#9d8270','#a58b77','#927b6a','#ae9480'][Math.floor(rand()*4)];t.fillRect(xx+2,y+2,60,20);}}
for(let i=0;i<4200;i++){let a=rand()*.09;t.fillStyle=rand()>.5?'rgba(255,255,236,'+a+')':'rgba(20,29,21,'+a+')';let size=kind==='gravel'?rand()*3+1:rand()*2+1;t.fillRect(rand()*256,rand()*256,size,size)}
if(kind==='plaster')for(let i=0;i<13;i++){t.fillStyle='#6c75630b';t.fillRect(rand()*256,rand()*256,1+rand()*7,10+rand()*90)}
if(kind==='wood'){t.strokeStyle='#5e574e55';t.lineWidth=2;for(let x=0;x<256;x+=32){t.beginPath();t.moveTo(x,0);t.lineTo(x,256);t.stroke()}}
if(kind==='concrete'){t.strokeStyle='#74796b66';t.lineWidth=2;t.strokeRect(1,1,254,254);t.strokeStyle='#5f6d5b30';t.beginPath();t.moveTo(25,45);t.lineTo(36,51);t.lineTo(40,68);t.stroke()}
const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;return map;}
const textures={};for(let k of ['brick','plaster','asphalt','concrete','gravel','roof','wood','iron'])textures[k]=textured(k);
function surface(kind,w=3,h=3,tint=0xffffff){let map=textures[kind].clone();map.repeat.set(Math.max(1,w/2.5),Math.max(1,h/2.5));map.needsUpdate=true;return new THREE.MeshStandardMaterial({map,color:tint,roughness:1})}
// Give existing architecture a consistent material scale and keep the silhouettes simple.
scene.traverse(o=>{if(!o.isMesh||o.geometry.type!=='BoxGeometry'||o.parent!==scene)return;let g=o.geometry.parameters,w=g.width,h=g.height,d=g.depth;if(h>=3&&Math.min(w,d)<.5&&Math.max(w,d)>5){o.material=surface(Math.abs(o.position.x)>40?'brick':'plaster',Math.max(w,d),h);}else if(h<.22&&w>5&&d>3){let kind=w>170&&d<=12?'asphalt':w>150&&d>100?'gravel':o.position.y<.15?'concrete':'roof';o.material=surface(kind,w,d,kind==='roof'?0xb0b4a3:0xffffff)}else if(w>150&&h<1){o.material=surface('gravel',w,d,0xa6ad8e);}});
// More building height, street-specific facades and rooftop silhouettes.
for(let b of [{x:-25,z:19,w:18,d:13,brick:false},{x:-24,z:-23,w:20,d:17,brick:true},{x:24,z:-25,w:20,d:18,brick:true},{x:54,z:-25,w:21,d:19,brick:false},{x:-53,z:-25,w:18,d:18,brick:true}]){
let upper=box(b.x,4.85,b.z-b.d*.2,b.w*.92,2.4,b.d*.52,0xc1bba9);upper.material=surface(b.brick?'brick':'plaster',b.w,2.4);box(b.x,6.15,b.z-b.d*.2,b.w*.96,.2,b.d*.56,0x697367);for(let side of [-1,0,1]){let xx=b.x+side*b.w*.28,zz=b.z+b.d*.06+.03;box(xx,4.88,zz,2.1,1.25,.08,0x6a8c91);box(xx,4.88,zz+.05,.055,1.3,.02,0xd8d8bf);box(xx,4.25,zz+.12,2.3,.12,.3,0x827c67);}box(b.x-b.w*.3,6.5,b.z-b.d*.3,1.3,.7,1.4,0x70766b);}
for(let p of [{x:54,z:51,w:27,d:22},{x:-54,z:55,w:24,d:20}]){let roof=new THREE.Mesh(new THREE.ConeGeometry(p.w*.74,3,4),surface('roof',p.w,p.d,0xa5a28b));roof.scale.z=p.d/p.w;roof.rotation.y=Math.PI/4;roof.position.set(p.x,5.1,p.z);roof.castShadow=true;scene.add(roof)}
// Contact shadows keep props and buildings grounded, without expensive real-time lights.
let shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;let sh=shadowCanvas.getContext('2d'),gradient=sh.createRadialGradient(64,64,8,64,64,63);gradient.addColorStop(0,'rgba(27,36,25,.28)');gradient.addColorStop(.6,'rgba(27,36,25,.12)');gradient.addColorStop(1,'rgba(27,36,25,0)');sh.fillStyle=gradient;sh.fillRect(0,0,128,128);const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
// v146: all contact shadows share one mesh (was one transparent draw call each). They are static, flat and the same
// colour, so the merged blend is identical whatever order the quads draw in.
const contactQuads=[];function contact(x,z,w,d){const g=new THREE.PlaneGeometry(w,d);g.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2).setPosition(x,.025,z));contactQuads.push(g);}
for(let c of CONTACTS)contact(c.x,c.z,1.7,1.3);for(let b of [[-25,19,24,19],[-24,-23,26,23],[24,-25,26,24],[53,22,25,23],[-53,-25,24,24],[-58,26,7,12]])contact(...b);
{const pos=[],nor=[],uv=[],idx=[];for(const g of contactQuads){const base=pos.length/3;pos.push(...g.attributes.position.array);nor.push(...g.attributes.normal.array);uv.push(...g.attributes.uv.array);for(const i of g.index.array)idx.push(base+i);g.dispose();}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeBoundingSphere();
 const p=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));p.name='Contact shadows';scene.add(p);}
// Utility poles, cables, crates, hydrants and mailboxes break up the old empty spaces.
for(let x of [-68,-36,14,52,81]){cyl(x,4,-11,.14,8,0x86745c);box(x,7.4,-11,2.5,.13,.13,0x736b56);for(let j of [-1,1])cyl(x+j*.85,7.62,-11,.06,.25,0xb8b9a5);}
for(let pair of [[-68,-36],[-36,14],[14,52],[52,81]])for(let z of [-10.3,-11.7]){let curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(pair[0],7.6,z),new THREE.Vector3((pair[0]+pair[1])/2,6.2,z),new THREE.Vector3(pair[1],7.6,z));let cable=new THREE.Mesh(new THREE.TubeGeometry(curve,16,.025,4,false),mat(0x4a5148));scene.add(cable)}
for(let x of [-35,14,44]){cyl(x,.45,11,.18,.7,0x9f5d45);sphere(x,.89,11,.22,0xb57151);box(x,.55,11,.7,.16,.16,0x9f5d45);}for(let x of [-20,35,70]){rounded(x,1,12,.65,.6,.9,0x6a8b8c);cyl(x,.45,12,.06,.9,0x6d7869);}
for(let p of [[-40,21],[-38,21],[-40,23],[38,-35],[41,-35],[38,-33]]){let c=box(p[0],.5,p[1],1.3,1,1.3,0xb19d7b);c.material=surface('wood',1.3,1);}
// A proper servo with a covered forecourt and shelves of fictional food flavourings.
room(-77,-35,17,14,'COASTWAY SERVO',0xc5c2b0,0x8b9b8c);counter(-77,-34);shelves(-82,-39);shelves(-72,-39);addPoint('servo','Coastway servo · Mixing ingredients',-77,-31,{actor:bobble(-77,-36,0x8e9f8b,0xd1a27f)});
box(-77,4.3,-20,17,.3,9,0xd4d1b9);box(-77,4.15,-15.4,17,.4,.2,0xa35f4b);sign('COASTWAY  •  OPEN 24/7',-77,4.18,-15.25,12,'#8e604c','#f4ead5');for(let x of [-84,-70])cyl(x,2.1,-19,.1,4.2,0x849183);for(let x of [-80,-74]){rounded(x,.9,-20,1.1,1.8,.85,0xc3bda5);box(x,1.35,-19.56,.65,.4,.03,0x526a61);box(x,.45,-19.5,1,.3,.1,0xa1614c);}
function atm(x,z){rounded(x,1.05,z,1,2.1,.65,0x4f665d);rounded(x,1.42,z+.35,.7,.5,.05,0x87baa8);box(x,1,z+.36,.65,.1,.03,0x242e29);box(x,.7,z+.36,.7,.2,.06,0x9aaba0);sign('ATM',x,2.35,z+.36,1.3,'#354f43','#b5d5a2');addPoint('atm','ATM · Cash ↔ online card',x,z+1.1)}atm(16,-12);atm(-17,27);
function recycleStation(x,z){rounded(x,1.1,z,1.8,2.2,1.2,0x74896a);box(x,1.4,z+.63,1.05,.55,.05,0x354b3b);rounded(x,.6,z+.65,.8,.4,.05,0xb7ba93);sign('TRASH FOR CASH',x,2.65,z+.62,2.8,'#566d4c','#e5e9cb');addPoint('recycler','Trash for cash · Recycling',x,z+1.5)}recycleStation(-38,9);recycleStation(67,-12);
const litter=[];for(let i=0;i<28;i++){let x=-65+(i*29)%137,z=(i%2?1:-1)*(8.2+(i%3)*2.2);if(blocked(x,z))continue;let g=new THREE.Group();g.position.set(x,.1,z);scene.add(g);if(i%3===0){let can=cyl(0,.08,0,.1,.22,0xa6b4ab,g,8);can.rotation.z=Math.PI/2;}else if(i%3===1){let bottle=cyl(0,.08,0,.075,.3,0x93a9a0,g,8);bottle.rotation.z=1.4;box(.17,.08,0,.08,.04,.05,0xc6b88a,false,g);}else{let paper=box(0,0,0,.28,.025,.22,0xc8c0a5,false,g);paper.rotation.y=i;}litter.push({id:i,g});addPoint('litter','Pick up litter',x,z,{id:i});}
// v146: litter draws as a few InstancedMeshes, one per piece kind (it was one or two draw calls per piece). The groups stay as
// position holders and still carry .visible; a picked piece collapses to zero scale on the next frame.
const litterInst=(()=>{const kinds=new Map(),zero=new THREE.Matrix4().makeScale(0,0,0);scene.updateMatrixWorld(true);
 for(const p of litter){p.parts=[];p.shown=true;for(const m of [...p.g.children]){if(!m.isMesh||Array.isArray(m.material))continue;const k=m.geometry.type+JSON.stringify(m.geometry.parameters||{})+m.material.uuid;let kind=kinds.get(k);if(!kind){kind={geo:m.geometry,mat:m.material,cast:m.castShadow,recv:m.receiveShadow,items:[]};kinds.set(k,kind);}kind.items.push({p,m:m.matrixWorld.clone()});p.g.remove(m);}}
 const meshes=[];for(const kind of kinds.values()){const im=new THREE.InstancedMesh(kind.geo,kind.mat,kind.items.length);im.name='Litter (instanced)';kind.items.forEach((it,i)=>{im.setMatrixAt(i,it.m);it.p.parts.push([im,i,it.m]);});im.instanceMatrix.needsUpdate=true;im.computeBoundingSphere?.();im.castShadow=kind.cast;im.receiveShadow=kind.recv;scene.add(im);meshes.push(im);}
 return {meshes,sync(){for(const p of litter){const v=p.g.visible!==false;if(p.shown===v)continue;p.shown=v;for(const [im,i,m] of p.parts){im.setMatrixAt(i,v?m:zero);im.instanceMatrix.needsUpdate=true;}}}};})();
{const litterFrame=renderFrame;renderFrame=function(){litterInst.sync();litterFrame();};}
const mixers=[];for(let [home,p]of [[0,{x:-23,z:44}],[1,{x:-53,z:58}],[2,{x:55,z:56}]]){let g=new THREE.Group();g.position.set(p.x,0,p.z);scene.add(g);box(0,.6,0,2.2,1.2,1.1,0x7b9386,false,g);box(0,1.27,0,2.4,.12,1.3,0xd2d2bd,false,g);cyl(-.4,1.55,0,.42,.5,0xa1b0a3,g);cyl(-.4,1.83,0,.42,.07,0x718677,g);rounded(.6,1.54,0,.55,.5,.65,0x647f72,g);sphere(.6,1.7,.34,.06,0xb9cf83,g);mixers.push(g);addFurnishing('mixer',p.x,p.z,2.4,1.3,home);addPoint('mix','Mixing station',p.x,p.z+1.4,{home});}
const previousPointVisible=pointVisible;pointVisible=function(p){if(p.type==='litter')return !s.picked[p.id]||s.picked[p.id]<s.day;if(p.type==='mix')return s.mixer&&(p.home===s.house);return previousPointVisible(p)};
const previousUI=updateUI;updateUI=function(){previousUI();litter.forEach(p=>p.g.visible=!s.picked[p.id]||s.picked[p.id]<s.day);mixers.forEach((g,i)=>g.visible=s.mixer&&i===s.house);$('bank').textContent=cash(s.bank);};
const previousAction=doAction;doAction=function(k,a,b,c){
if(k==='payment'){if(!['cash','card'].includes(a))return;s.payment=a;save();menu(panel,selected);return;}
if(k==='ingredient'){if(!Number.isInteger(a)||!INGREDIENTS[a]||!spend(INGREDIENTS[a].cost))return;s.ingredients[a]++;toast(INGREDIENTS[a].name+' bought');save();menu('servo');return;}
if(k==='buyMixer'){if(!s.room||s.mixer||level()<2||!spend(500))return;s.mixer=true;save();toast('Mixing station installed at your active property');menu('hardware');return;}
if(k==='mix'){if(!s.mixer||!Number.isInteger(a)||a<0||a>=BASE_COUNT||!Number.isInteger(b)||!INGREDIENTS[b]||s.ingredients[b]<1)return;let available=s.gummies[a]+Math.max(0,s.packs[a]-reservedQty(a));if(!available)return;if(s.gummies[a])s.gummies[a]--;else s.packs[a]--;s.ingredients[b]--;const result=mixedStrainIndex(a,b,BASE_COUNT);s.gummies[result]++;s.mixed++;s.xp+=2;startWork('Mixing '+STRAINS[result].name+'…',3);save();toast(STRAINS[result].name+' created · value '+cash(value(result))+'. Wrap it before listing.');return;}
if(k==='atmDeposit'||k==='atmWithdraw'){if(!Number.isInteger(a)||a<1||a>1000000)return;let from=k==='atmDeposit'?'cash':'bank',to=from==='cash'?'bank':'cash';if(s[from]<a){toast('Not enough '+(from==='bank'?'card balance.':'cash.'));return}s[from]-=a;s[to]+=a;record(from==='cash'?'ATM cash deposit':'ATM cash withdrawal',from==='cash'?a:-a);save();toast(cash(a)+' transferred. No fee.');menu('atm');return;}
if(k==='pickup'){let p=litter.find(p=>p.id===a);if(!p||s.picked[a]>=s.day||Math.hypot(player.x-p.g.position.x,player.z-p.g.position.z)>3)return;s.picked[a]=s.day;s.trash++;close();save();toast('Litter collected · '+s.trash+' in your bag');return;}
if(k==='recycle'){if(!s.trash)return;let pay=Math.round(s.trash*25)/100;s.cash=Math.round((s.cash+pay)*100)/100;s.trashEarned+=pay;s.trash=0;record('Recycling payout (cash)',0);save();toast('Recycling paid '+cash(pay)+' cash');menu('recycler');return;}
if(k==='seed'&&a>=BASE_COUNT)return;
previousAction(k,a,b,c);
};
ACTION_NAMES.push('payment','ingredient','buyMixer','mix','atmDeposit','atmWithdraw','pickup','recycle');
const previousAct=act;act=function(){if(active&&!panel&&!work&&near?.type==='litter')action('pickup',near.id);else previousAct()};
const previousMenu=menu;menu=function(which,data){previousMenu(which,data);if(processingRemote)return;document.body.classList.toggle('titleMode',which==='title');document.body.classList.toggle('hasMenu',!!panel);if(which==='title'){$('modal').innerHTML=`<div class="titleBrand"><span>GUMMY</span><span>BAY</span></div><div class="titleSub">GRAMPS’ LAST CALL · v131</div><nav class="titleNav"><button onclick="slots('story')">STORY / CONTINUE</button><button onclick="slots('free')">FREE PLAY</button><button onclick="menu('join')">MULTIPLAYER</button><button onclick="menu('settings')">SETTINGS</button></nav><div class="titleFooter">A coastal business sandbox<br><span>Original town · fictional gummies · 2-player co-op</span></div>`;return;}
if(['reception','hardware','dealer','store','servo','helpers'].includes(which)){$('modal').innerHTML=`<div class="paymentstrip"><span>PAYMENT</span><button class="${s.payment==='cash'?'on':''}" onclick="action('payment','cash')">CASH ${cash(s.cash)}</button><button class="${s.payment==='card'?'on':''}" onclick="action('payment','card')">CARD ${cash(s.bank)}</button></div>`+$('modal').innerHTML;}
if(which==='hardware')$('modal').innerHTML+=row('Mixing station','Level 2 · one-time equipment purchase. Combine gummies with servo flavourings.',s.mixer?'OWNED':level()<2?'LEVEL 2':'$500',"action('buyMixer')",s.mixer||level()<2||!s.room||availableMoney()<500);
if(which==='servo'){$('modal').innerHTML+=servoMenuHTML();}
if(which==='mix'){$('modal').innerHTML+=mixMenuHTML();}
if(which==='atm'){$('modal').innerHTML+='<div class="overline">COASTLINE BANK / ATM</div><h2>Cash ↔ online card</h2><div class="bankcard"><div>COASTLINE <small>GUMMY BAY BUSINESS</small></div><b>'+cash(s.bank)+'</b><span>▥ &nbsp; •••• &nbsp; •••• &nbsp; 0400</span><small>PREPAID ONLINE BALANCE · NO DEBT</small></div><p>Deposit cash to use your card in shops, or withdraw card funds as cash. Transfers are instant, with no fee. New saves still start with $400 cash and $0 card balance.</p><div class="form"><label>Amount $ <input id="atmAmount" type="number" min="1" max="1000000" value="50"></label><button class="primary" onclick="action(\'atmDeposit\',Number(document.getElementById(\'atmAmount\').value))">Deposit cash</button><button class="ghost" onclick="action(\'atmWithdraw\',Number(document.getElementById(\'atmAmount\').value))">Withdraw cash</button></div>';}
if(which==='recycler')$('modal').innerHTML+='<div class="overline">TRASH FOR CASH / RETURN STATION</div><h2>Clean streets. Small change.</h2><p>Pick up cans, bottles and paper scattered around town with E. Each item earns just $0.25. Litter refreshes each in-game day.</p>'+row('Your recycling bag',s.trash+' pieces · '+cash(s.trash*.25)+' payout','Return all',"action('recycle')",!s.trash)+'<p class="note">Lifetime recycling income: '+cash(s.trashEarned)+'</p>';
if(which==='phone')$('modal').innerHTML= '<div class="tabs"><button onclick="menu(\'phone\')">Messages</button><button onclick="menu(\'wallet\')">Online card</button><button onclick="menu(\'listing\')">Listings</button></div>'+$('modal').innerHTML;
if(which==='wallet')$('overlay').classList.toggle('phone',true);
if(which==='wallet')$('modal').innerHTML+='<div class="overline">PHONE / ONLINE CARD</div><h2>Your money.</h2><div class="bankcard"><div>COASTLINE <small>BUSINESS CARD</small></div><b>'+cash(s.bank)+'</b><span>▥ &nbsp; •••• &nbsp; •••• &nbsp; 0400</span></div>'+row('Cash in your wallet',cash(s.cash)+' available.','Find ATM',"trackPlace('atm')")+'<h3>Recent card transactions</h3>'+s.ledger.map(t=>'<div class="ledger"><span>Day '+t.day+' · '+esc(t.label)+'</span><strong>'+((t.amount>0?'+':'')+cash(t.amount))+'</strong></div>').join('');
if(which==='bag')$('modal').innerHTML+=row('Ingredients & recycling',INGREDIENTS.map((f,i)=>f.name+': '+s.ingredients[i]).join(' · ')+'<br>'+s.trash+' pieces of litter in your bag.','Find servo',"trackPlace('servo')");
if(which==='map')for(let type of ['servo','mix','atm','recycler']){let p=points.find(p=>p.type===type&&pointVisible(p))||points.find(p=>p.type===type);$('modal').innerHTML+=row(p.label,type==='mix'&&!s.mixer?'Buy the station at Hank’s.':(p.x<0?'West':'East')+' side of town','Track',`trackPlace('${type}')`);}
if(which==='journal')$('modal').innerHTML+='<h3>Mixing & money</h3><p>Level 2 unlocks the $500 mixing station at Hank’s. The bench mixes one base gummy with a servo ingredient. Effects rewrite in order, the same set keeps the same recipe name, and a new set is worth 80 XP. Mix, wrap, list, text, bargain, deliver.<br>ATMs transfer cash to your online card and back. Select cash or card at each shop. Pick up litter and return it for $0.25 each.</p>';
if(which==='pause')$('modal').innerHTML+=row('Graphics & mouse','Quality, sensitivity and optional full mouse capture.','Settings',"menu('settings')");
if(which==='settings'){$('modal').innerHTML+='<div class="overline">SETTINGS / GRAPHICS & INPUT</div><h2>Make yourself comfortable.</h2><p>Hold and drag the world to look, or enable full mouse capture below. The camera stays still when you release the drag. Escape opens the menu. Touch: swipe to look.</p><div class="form"><label>Graphics <select onchange="setQuality(this.value)"><option value="performance" '+(quality==='performance'?'selected':'')+'>Low · phones and software</option><option value="balanced" '+(quality==='balanced'?'selected':'')+'>Medium · soft shadows</option><option value="high" '+(quality==='high'?'selected':'')+'>High · bloom and grade</option></select></label></div><div class="form"><label>Sensitivity <input type="range" min="0.0005" max="0.008" step="0.0001" value="'+lookSensitivity+'" oninput="setSensitivity(Number(this.value))"></label></div><button class="ghost" onclick="fullMouseCapture()">Optional full mouse capture</button><p class="note">Low skips shadows and the colour pass so phones and software renderers stay responsive. High adds bloom, a grade and a vignette. Phones and SwiftShader start on Low.</p>';}
};
function setSensitivity(v){lookSensitivity=v;try{localStorage.setItem('gummybay-sensitivity',String(v))}catch(e){}}
function setFov(v){fovBase=Math.max(60,Math.min(100,Number(v)||FOV_BASE));if(!comfort.sprintFov){camera.fov=fovBase;camera.updateProjectionMatrix();}try{localStorage.setItem('gummybay-fov',String(fovBase))}catch(e){}}
function setBobAmount(v){bobAmount=Math.max(0,Math.min(1,Number.isFinite(v)?v:BOB_AMOUNT));try{localStorage.setItem('gummybay-bob',String(bobAmount))}catch(e){}}
window.setFov=setFov;window.setBobAmount=setBobAmount;
function fullMouseCapture(){if(!active){toast('Start a saved game first.');return}close();try{canvas.requestPointerLock?.()?.catch(()=>toast('Mouse capture is blocked. Hold and drag the world to look.'))}catch(e){toast('Hold and drag the world to look.')}}
const previousClose=close;close=function(){previousClose();document.body.classList.toggle('hasMenu',!!panel)};
Object.assign(window,{menu,action,act,closeMenu:close,setQuality,setSensitivity,fullMouseCapture});
// Main-menu settings are allowed without loading a save.
const settingsMenu=menu;menu=function(which,data){if(!active&&which==='settings'){let was=active;active=true;settingsMenu(which,data);active=was;}else settingsMenu(which,data)};window.menu=menu;
if(typeof location!=='undefined'&&typeof location.search==='string'){const shotParams=new URLSearchParams(location.search);shotKind=shotParams.get('shot')||'';streetShot=shotKind==='starter'||shotKind==='opening'||shotKind==='city';if(shotKind==='city'){const c=(shotParams.get('cam')||'').split(',').map(Number);shotCam=c.length===6&&c.every(Number.isFinite)?c:[-20,60,90,-40,0,0];}if(streetShot){const hour=Number(shotParams.get('hour'));if(Number.isFinite(hour))shotHour=((hour%24)+24)%24;else if(shotKind==='opening')shotHour=9;}}
if(!(streetShot&&new URLSearchParams(location.search).get('streetBudget')==='off'))starterStreet=createStarterStreet({scene,quality});
setQuality(quality);

addEventListener('keydown',e=>{if(!active||panel||work||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(stationTask||placeMode)return;if(hotbarSlot(e.key)){e.preventDefault();useHotbarSlot(e.key);}});
// Atmospheric sky and a stylized moving bay, built from local shaders.
const skyUniforms={top:{value:new THREE.Color(0x6d9daf)},bottom:{value:new THREE.Color(0xc7c5ae)},night:{value:1}};
const skyDome=new THREE.Mesh(new THREE.SphereGeometry(290,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:skyUniforms,vertexShader:'varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 direction;uniform vec3 top;uniform vec3 bottom;uniform float night;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}void main(){vec3 dir=normalize(direction);float h=clamp(dir.y,0.,1.);vec3 col=mix(bottom,top,pow(h,.55));vec2 p=dir.xz/max(.15,dir.y)*2.;float n=noise(p)*.6+noise(p*2.1)*.28+noise(p*4.3)*.12;float cloud=smoothstep(.53,.73,n)*smoothstep(.03,.22,h);col=mix(col,vec3(.9,.91,.88),cloud*.72);gl_FragColor=vec4(col*night,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));skyDome.renderOrder=-20;scene.add(skyDome);
const waterUniforms={uTime:{value:0},uLight:{value:1},uFog:{value:new THREE.Color(0xa4bfc8)},uFogNear:{value:80},uFogFar:{value:266}};
const ocean=new THREE.Mesh(new THREE.PlaneGeometry(660,140,100,40),new THREE.ShaderMaterial({uniforms:waterUniforms,vertexShader:'varying vec2 vUv;varying vec3 world;uniform float uTime;void main(){vUv=uv;vec3 p=position;p.z+=sin(p.x*.3+uTime*.8)*.035+sin(p.y*.5+uTime*.6)*.028;vec4 w=modelMatrix*vec4(p,1.);world=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',fragmentShader:'varying vec2 vUv;varying vec3 world;uniform float uTime;uniform float uLight;uniform vec3 uFog;uniform float uFogNear;uniform float uFogFar;void main(){float w=sin(world.x*.55+world.z*.9+uTime*.65)*.5+.5;float wave=smoothstep(.96,1.,w)*.17;float stripe=sin(world.z*3.5+uTime*.8+sin(world.x*.12))*.025;vec3 c=mix(vec3(.18,.39,.42),vec3(.33,.54,.55),vUv.y)+wave+stripe;c*=uLight;float fog=smoothstep(uFogNear,uFogFar,distance(cameraPosition,world));gl_FragColor=vec4(mix(c,uFog,fog),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));ocean.rotation.x=-Math.PI/2;ocean.position.set(0,-.375,128);ocean.receiveShadow=false;scene.add(ocean);
// Narrow kerb faces join the existing road and pavements, leaving crossings open.
for(const side of [-1,1])for(const direction of [-1,1]){
 box(direction*49,.045,side*6.35,74,.13,.18,0xa9afa5);
 box(side*6.35,.045,direction*40,.18,.13,56,0xa9afa5);
}
// Street furniture and building-specific details, kept outside walking paths.
const buildings=[{x:-25,z:19,w:18,d:13},{x:-25,z:40,w:18,d:17},{x:25,z:22,w:18,d:17},{x:-24,z:-23,w:20,d:17},{x:24,z:-25,w:20,d:18},{x:53,z:22,w:19,d:17},{x:54,z:-25,w:21,d:19},{x:-53,z:-25,w:18,d:18}];
for(let b of buildings){
let front=b.z+b.d/2,back=b.z-b.d/2;
// Skirting, drainpipes and darker recessed entrance trim add scale to flat walls.
box(b.x, .17,back+.15,b.w-.6,.25,.08,0x736e5c);for(let side of [-1,1]){box(b.x+side*(b.w/2-.2),.17,b.z,.08,.25,b.d-.5,0x827c66);cyl(b.x+side*(b.w/2-.45),1.7,front+.18,.055,3.3,0x6a7a6a);box(b.x+side*b.w*.23,1.35,front+.2,.1,2.65,.16,0x53634f);}
box(b.x,2.66,front+.22,b.w*.45,.1,.17,0x6b755b);box(b.x,.04,front+.3,b.w*.46,.025,1.2,0x656d55);
// A tiled runner and a suspended fluorescent fitting inside each shop.
let tile=box(b.x,.031,b.z,4,.015,b.d-1.1,0xd2d0bb);tile.material=surface('concrete',4,b.d-1.1,0xc0c0a8);
box(b.x,3.32,b.z,2.3,.09,.65,0x7f8a79);let lamp=box(b.x,3.25,b.z,2.1,.04,.5,0xe2ddbd);lamp.material=new THREE.MeshStandardMaterial({color:0xe4e2bc,emissive:0xd7c997,emissiveIntensity:.45});lamp.castShadow=false;interiorFittings.push({mesh:lamp,x:b.x,z:b.z});
// Vents and posters are shallow decorations and do not alter collisions.
for(let i=0;i<4;i++)box(b.x+b.w*.34,2.6,back+.16,1.4,.045,.03,0x909b84);
}
// Better motel room: wood floor, bedside table, alarm clock, rug, artwork and curtains.
let floor=box(-25,.026,40,17.3,.012,16.3,0xd1c09b);floor.material=surface('wood',17.3,16.3,0xd3c5aa);box(-31,.04,42,3.6,.02,5,0x817d5f);box(-29.1,.46,43,1,.9,1,0x9d8664);addFurnishing('bedside',-29.1,43,1,1,0);rounded(-29.1,1.03,43,.55,.3,.27,0x64715c);box(-29.1,1.05,43.15,.36,.14,.02,0x9fb08e);box(-32.4,1.9,37,.5,1.8,.1,0xd3c9ac);sign('ONE DAY AT A TIME',-25,2.05,31.68,4.1,'#7d8370','#d9dabd');
for(let [x,z]of [[-31.3,48.4],[-18.7,48.4]])for(let i=0;i<6;i++)cyl(x+(i-2.5)*.28,1.8,z,.18,1.5,i%2?0x9ba17e:0xaab08a);
// Distinct interiors: coffee station, notice board, hardware tools and price cards.
sign('ROOM 04  •  $75 DEPOSIT',-25,1.85,12.7,5.5,'#495c4e','#d1d6b9');
box(-19,1.35,15,.8,.7,.6,0x647569);cyl(-19,1.8,15,.15,.32,0xc5c3a2);box(-19.8,1.04,15,2.6,.12,1,0x9e8968);
sign('LOCAL JOBS  /  ASK INSIDE',-53,2,-33.8,5.4,'#76674e','#e0d5b7');
for(let i=0;i<5;i++){let handle=cyl(-30+i*1.15,1.8,-31.25,.035,.65,0xa69774);let tool=box(-30+i*1.15,2.16,-31.25,.35,.13,.1,0x76877e);tool.rotation.z=i%2*.4;}
for(let i=0;i<6;i++){let pot=cyl(18+i*2.5,2.8,14.6,.2,.35,0xb49770);sphere(18+i*2.5,3.05,14.6,.25,0x92aa6f);}
for(let i=0;i<4;i++){rounded(17+i*4,2.6,-33.6,1.4,.5,.12,[0xa5b679,0xd0b174,0xb494b0,0x89acad][i]);}
sign('FRESH FLAVOURS  /  SMALL BATCH',25,1.9,13.68,6.1,'#6a7c58','#e0dfbd');
// Window air conditioners, wall lamps and small alleys make the buildings feel inhabited.
for(let b of [{x:-25,z:19,w:18,d:13},{x:-24,z:-23,w:20,d:17},{x:54,z:-25,w:21,d:19}]){let x=b.x+b.w/2+.35,z=b.z-2;box(x,2.5,z,.65,.85,1.4,0x8a9588);for(let j=0;j<5;j++)box(x+.34,2.22+j*.12,z,.03,.035,1.1,0x617366);}
// A proper campsite setup, with outdoor chairs, a folding table and canvas shade.
for(let x of [-63,-53]){for(let z of [34,35.2]){cyl(x-.35,.4,z,.035,.8,0x7c8c7f);cyl(x+.35,.4,z,.035,.8,0x7c8c7f);}box(x,.65,34.5,.85,.08,1.1,0x7a8e73);box(x,1.05,35.1,.85,.8,.06,0x7a8e73);}
box(-58,.8,34.6,2.3,.08,1.2,0xa79978);for(let side of [-1,1])box(-58+side*.8,.4,34.6,.08,.8,.9,0x8c927d);cyl(-58,.94,34.6,.11,.25,0xc4ba98);
// Grass clumps use one instanced draw call rather than hundreds of independent meshes.
const grassGeo=new THREE.BufferGeometry();grassGeo.setAttribute('position',new THREE.Float32BufferAttribute([-.12,0,0,0,.35,0,.12,0,0,0,0,-.12,0,.26,0,0,0,.12],3));grassGeo.computeVertexNormals();const grass=new THREE.InstancedMesh(grassGeo,new THREE.MeshStandardMaterial({color:0x7d9861,side:THREE.DoubleSide,roughness:1}),190);let grassCount=0;let seed=555;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const transform=new THREE.Object3D();for(let i=0;i<1000&&grassCount<190;i++){let x=random()*170-85,z=random()*140-70;if(Math.abs(x)<14||Math.abs(z)<14||blocked(x,z)||buildings.some(b=>Math.abs(x-b.x)<b.w*.6&&Math.abs(z-b.z)<b.d*.65)||x< -35&&z>10&&z<43)continue;transform.position.set(x,-.03,z);transform.rotation.y=random()*6.28;transform.scale.setScalar(.5+random()*.8);transform.updateMatrix();grass.setMatrixAt(grassCount,transform.matrix);grass.setColorAt(grassCount,new THREE.Color([0x90a77b,0xb0ad7b,0x79916e][grassCount%3]));grassCount++;}grass.count=grassCount;grass.receiveShadow=true;scene.add(grass);
// Pine silhouettes on the ridge, with sparse cones rather than more round spheres.
// v134: the old cone-tree row in front of the -77 shopfronts is replaced by instanced stylised trees placed off frontages (light-grade.mjs).
// Exterior illustrations are original canvas signs, rather than generic blank panels.
function shopLogo(x,z,name,kind,color){let c=document.createElement('canvas');c.width=512;c.height=512;let t=c.getContext('2d');t.fillStyle='#ded6b6';t.fillRect(0,0,512,512);t.fillStyle=color;t.fillRect(15,15,482,482);t.fillStyle='#eee7ca';t.textAlign='center';drawSignText(t,name,{x:32,y:375,width:448,height:100},{maxFont:42,minFont:28});t.lineWidth=14;t.strokeStyle='#eee7ca';if(kind==='plant'){t.beginPath();t.moveTo(256,325);t.lineTo(256,140);t.stroke();t.beginPath();t.ellipse(207,195,63,30,-.5,0,6.3);t.fill();t.beginPath();t.ellipse(304,250,63,30,.5,0,6.3);t.fill();}else if(kind==='tool'){t.save();t.translate(256,230);t.rotate(-.6);t.fillRect(-18,-110,36,220);t.fillRect(-75,-110,150,50);t.restore();}else{t.beginPath();t.roundRect(180,150,150,160,20);t.fill();t.beginPath();t.arc(220,125,40,0,7);t.arc(300,125,40,0,7);t.fill();t.fillRect(175,295,60,55);t.fillRect(275,295,60,55);}let tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;let m=new THREE.Mesh(new THREE.PlaneGeometry(1.15,1.15),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));m.position.set(x,1.7,z);scene.add(m);}
shopLogo(19.1,30.7,'MILO’S','plant','#70825c');shopLogo(-30.8,-14.3,'HARDWARE','tool','#7c8168');shopLogo(30.4,-15.8,'GUMMIES','gummy','#9b7b60');
const smallDetails=[];scene.traverse(o=>{if(o.isMesh&&o.parent===scene&&o.geometry.type==='BoxGeometry'){const d=o.geometry.parameters;if(d.width<3&&d.height<.55&&d.depth<2){o.castShadow=false;smallDetails.push(o)}}});
const artFrame=renderFrame;renderFrame=function(){
skyDome.position.copy(camera.position);waterUniforms.uTime.value=now;
for(let o of smallDetails){if(o.__batchParent)continue;o.visible=camera.position.distanceToSquared(o.position)<6400;}
for(let g of avatars){let id=g.userData.id;let phase=(now+id*.63)%5.3;g.userData.eyes.scale.y=phase>4.9&&phase<5.07?.1:1;g.userData.torso.scale.y=1+Math.sin(now*1.8+id)*.008;g.userData.left.rotation.z=.035+Math.sin(now*1.1+id)*.025;g.userData.right.rotation.z=-.035-Math.sin(now*1.1+id)*.025;if(g===patrol){g.userData.left.rotation.x=Math.sin(now*2.1)*.2;g.userData.right.rotation.x=-Math.sin(now*2.1)*.2;}}
artFrame();};
// ART V6 — depth, material response and close-range shadow fidelity.
const beforeV6=new Set(scene.children);
// A small original painted sky cubemap gives glass and metal a readable reflection.
const reflectionFaces=[];
for(let face=0;face<6;face++){
 const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
 const grad=ctx.createLinearGradient(0,0,0,128);grad.addColorStop(0,'#789daa');grad.addColorStop(.5,'#bdc8bd');grad.addColorStop(.54,'#7d8e78');grad.addColorStop(1,'#4f5e50');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);
 if(face!==2&&face!==3){ctx.fillStyle='#65766b';for(let j=0;j<7;j++)ctx.fillRect(j*21,65-(j%3)*6,16,16+(j%3)*6);ctx.fillStyle='#dfd7b2';ctx.fillRect(15,25,50,7);}
 reflectionFaces.push(c);
}
const reflectionMap=new THREE.CubeTexture(reflectionFaces);reflectionMap.colorSpace=THREE.SRGBColorSpace;reflectionMap.needsUpdate=true;
scene.traverse(o=>{if(!o.isMesh||!o.material?.isMeshStandardMaterial)return;const m=o.material;
 if(m.metalness>.1){m.envMap=reflectionMap;m.envMapIntensity=.48;m.needsUpdate=true;}
 // Replace opaque cyan window slabs with darker reflective architectural glass.
 if([0x80b7bd,0x6a8c91,0x80aeb0,0x8bb9ba].includes(m.color.getHex())){o.material=new THREE.MeshStandardMaterial({color:0x426267,roughness:.18,metalness:.38,envMap:reflectionMap,envMapIntensity:.65});}
});
for(const row of facadeWindows){Object.assign(row.mesh.material,{transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide});row.mesh.userData.windowConnection=true;}
// Break up sphere canopies into asymmetrical faceted crowns; retain trunks and collisions.
let canopyIndex=0;
scene.traverse(o=>{if(!o.isMesh||o.parent!==scene||o.geometry.type!=='SphereGeometry')return;
 const r=o.geometry.parameters.radius;if(r<.8||r>2||o.position.y<2.1||o.position.y>6)return;
 const geo=new THREE.IcosahedronGeometry(r,1),a=geo.attributes.position;
 for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i),z=a.getZ(i);const f=1+.12*Math.sin(x*3.4+y*2.1+z*1.7);a.setXYZ(i,x*f,y*f,z*f);}geo.computeVertexNormals();o.geometry=geo;
 o.material=new THREE.MeshStandardMaterial({color:[0x657f49,0x7d9653,0x8ea367,0x718b53][canopyIndex++%4],roughness:1,flatShading:true});
});
// Individual facade treatments: sills, recessed surrounds, cornices and brick footings.
for(const b of buildings){const front=b.z+b.d/2;
 for(const side of [-1,1]){const x=b.x+side*b.w*.35,w=b.w*.18;
  box(x,2.51,front+.24,w+.32,.1,.3,0xd3c9ae);box(x,1.08,front+.28,w+.35,.12,.43,0xb7ac91);
  for(let j=0;j<3;j++)box(x-w*.34+j*w*.34,1.74,front+.245,.026,1.24,.027,0xc7c9b1);
  let base=box(b.x+side*b.w*.35,.43,front+.145,b.w*.3,.72,.075,0x9b8e77);base.material=surface('brick',b.w*.3,.72,0xa4a08a);
  box(b.x+side*(b.w/2-.19),1.77,front+.21,.32,3.48,.3,0xc9c4ac);
 }
 box(b.x,3.52,front+.3,b.w+.4,.13,.5,0x6f7767);box(b.x,3.68,front+.32,b.w+.7,.14,.58,0xb8b79d);
 // Rain gutter and downspout elbow.
 box(b.x,3.39,front+.43,b.w+.35,.12,.13,0x657269);
}
// Sidewalk joints, curb faces, drain grates and manhole covers at street level.
for(let side of [-1,1]){
 let curb=box(0,.075,side*6.47,180,.23,.16,0x9ca28d);curb.material=surface('concrete',180,.23,0xc8c8b1);
 let edge=box(side*6.47,.075,0,.16,.23,145,0x9ca28d);edge.material=surface('concrete',145,.23,0xc8c8b1);
 for(let x=-85;x<89;x+=4){if(Math.abs(x)<12)continue;box(x,.109,side*8.4,.018,.009,3.5,0x8e9483);}
 for(let z=-69;z<72;z+=4){if(Math.abs(z)<12)continue;box(side*8.4,.109,z,3.5,.009,.018,0x8e9483);}
 for(let x of [-64,-35,25,60]){box(x,.019,side*5.75,1.1,.018,.45,0x3e4c46);for(let j=0;j<7;j++)box(x-.45+j*.15,.031,side*5.75,.05,.01,.43,0x798375);}
}
for(let [x,z]of [[-12,2],[44,-2],[2,-42],[2,35]]){cyl(x,.023,z,.62,.025,0x47534d,scene,20);for(let j=-2;j<=2;j++)box(x,.042,z+j*.16,.75,.01,.025,0x6a786b);}
// Edge wear and patches make road scale clear without noisy full-screen textures.
for(let [x,z,w,d]of [[-38,1,4,3],[47,-2,3,2],[-2,50,2,4],[2,-31,3,5]]){let patch=box(x,.009,z,w,.012,d,0x5d645d);patch.material=surface('asphalt',w,d,0x8c9589);}
// Warm practical light inside shops, with a strict two-light budget.
const interiorLights=[new THREE.PointLight(0xffd6a0,0,11,2),new THREE.PointLight(0xe9dabb,0,10,2)];for(let l of interiorLights)scene.add(l);
const indoorAnchors=buildings.map((b,i)=>({id:'shop:'+i,x:b.x,z:b.z,y:2.8}));indoorAnchors.push({id:'rv',x:-58,z:26,y:2.6});
// Decorative porch sconces add a bright, readable entrance at dusk.
const porchBulbs=[];const porchBulbMaterial=new THREE.MeshStandardMaterial({color:0xe9c88f,emissive:0xffbf69,emissiveIntensity:.8});
for(let b of buildings){let z=b.z+b.d/2+.5;for(let side of [-1,1]){let x=b.x+side*b.w*.25;box(x,2.3,z,.18,.38,.18,0x48584c);let bulb=rounded(x,2.3,z+.11,.11,.26,.08,0xe9d0a0);bulb.material=porchBulbMaterial;bulb.castShadow=false;porchBulbs.push(bulb);}}
// Lodged rocks along the coast replace the perfectly straight shoreline silhouette.
for(let i=0;i<30;i++){const x=-87+i*6.1;if(Math.abs(x)<8)continue;let rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.65+(i%4)*.2,0),mat([0x858d78,0x9da38a,0x707e70][i%3]));rock.position.set(x,.1,77+(i%3)*1.2);rock.scale.set(1.4,.6,1);rock.rotation.set(i*.3,i*.8,0);rock.castShadow=true;rock.receiveShadow=true;scene.add(rock);}
// Store hanging boards are restrained silhouettes, not floating interface labels.
for(let [x,z,word] of [[-34,25.6,'VACANCY'],[34,-16,'OPEN'],[34,30.5,'SEEDS']]){box(x,2.75,z,.09,.09,1.1,0x4b5a4e);cyl(x,2.5,z+.35,.025,.5,0x4b5a4e);sign(word,x,2.11,z+.38,1.8,'#455a49','#e7d4a0');}
// Batch repeated static trim and sidewalk seams to keep their GPU draw-call cost low.
const trimBatches=new Map();for(let o of scene.children){if(beforeV6.has(o)||!o.isMesh||o.geometry.type!=='BoxGeometry')continue;let k=o.geometry.uuid+o.material.uuid;if(!trimBatches.has(k))trimBatches.set(k,[]);trimBatches.get(k).push(o);}
for(let meshes of trimBatches.values()){if(meshes.length<3)continue;let first=meshes[0],batch=new THREE.InstancedMesh(first.geometry,first.material,meshes.length);meshes.forEach((o,i)=>{o.updateMatrix();batch.setMatrixAt(i,o.matrix);scene.remove(o)});batch.receiveShadow=true;batch.castShadow=first.geometry.parameters.height>.2;batch.computeBoundingSphere();scene.add(batch);}
scene.add(sun.target);
const depthFrame=renderFrame;
renderFrame=function(){
 // Snap shadow centre to texels to suppress shimmering as the player walks.
 let centerX=Math.round(camera.position.x*16)/16,centerZ=Math.round(camera.position.z*16)/16;
 const sunPlace=sunOffset(sceneLighting(s.time,active));
 sun.target.position.set(centerX,0,centerZ);sun.position.set(centerX+sunPlace.x,sunPlace.y,centerZ+sunPlace.z);sun.target.updateMatrixWorld();
 // Colour, intensity and practical-light assignment have one render owner.
 depthFrame();
};

// Original Blender architecture. Existing world stays usable if asset loading fails.
let townAssetStatus='loading',visualTown=null;
function installTown(gltf){
 const oldUpper=[];
 scene.traverse(o=>{if(!o.isMesh||o.parent!==scene||o.geometry.type!=='BoxGeometry'||o.position.y<4.05)return;
 if(buildings.some(b=>Math.abs(o.position.x-b.x)<b.w*.55&&Math.abs(o.position.z-b.z)<b.d*.6))oldUpper.push(o);
 });oldUpper.forEach(o=>scene.remove(o));
 const town=gltf.scene;town.name='Blender environment v11';rv.visible=false;town.children.forEach(chunk=>{const bounds=new THREE.Box3().setFromObject(chunk);chunk.userData.center=bounds.getCenter(new THREE.Vector3());chunk.userData.radius=bounds.getSize(new THREE.Vector3()).length()/2;});town.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;if(o.material?.metalness>.1){o.material.envMap=reflectionMap;o.material.envMapIntensity=.4;o.material.needsUpdate=true;}});scene.add(town);visualTown=town;townAssetStatus='ready';
 const shells=townGapColliders(town,{covered:(x,z)=>staticBlocked(x,z),openFootprints:DOORWAY_REVEAL_SITES,preserve:DOORWAY_REVEAL_SITES.map(site=>({x:site.x,z:site.z+site.d/2,w:2,d:2.8})).concat([{x:-55.6,z:26.75,w:8,d:2.2}]),ignoreName:name=>name==='RV'});
 for(const shell of shells)colliders.push(shell);
}
if(typeof GLTFLoader!=='undefined')new GLTFLoader().load('./assets/environment-v11-final.glb',installTown,e=>{if(e?.total>0)cine.townBytes=e.loaded/e.total;},error=>{townAssetStatus='failed';console.warn('Blender town could not load',error);toast('Town artwork did not load. Refresh to retry.');});
// Restore open-land colour instead of the previous all-over brown gravel.
for(let o of scene.children){if(o.isMesh&&o.geometry.type==='BoxGeometry'){let d=o.geometry.parameters;if(d.width===220&&d.depth===185)o.material=new THREE.MeshStandardMaterial({color:0x819563,roughness:1});}}
// Ten times the previous rectangular playable area: 178 × 171 × 10 square units.
const DISTRICTS=TRAVEL_DISTRICTS;
const districtBuildings=[...DISTRICT_BUILDING_SITES];
colliders.push(...districtBuildings);
const expansionStart=new Set(scene.children);
box(0,-.37,(WORLD.minZ+75)/2,580,.6,75-WORLD.minZ,0x819563);
const streetMat=gritMaterial('asphalt'),walkMat=gritMaterial('concrete');
const roadXs=[-270,-105,0,105,270],roadZs=[-90,-160,-230,-300,-370,-435];
for(let x of roadXs){let from=x===0?-72:-7,to=WORLD.minZ+4;let road=box(x,-.012,(from+to)/2,12,.035,from-to,0x626d65);road.material=streetMat;
 for(let side of [-1,1]){let pavement=box(x+side*8.1,.025,(from+to)/2,4,.12,from-to,0xc4c1a9);pavement.material=walkMat;}
 for(let z=-80;z>to;z-=9)box(x,.012,z,.11,.01,4,0xdfd9b9);
}
for(let z of roadZs){let road=box(0,-.008,z,555,.035,12,0x626d65);road.material=streetMat;for(let side of [-1,1])box(0,.025,z+side*8.1,555,.12,4,0xbab7a2);for(let x=-272;x<275;x+=9)if(roadXs.every(rx=>Math.abs(rx-x)>9))box(x,.017,z,4,.01,.11,0xdfd9b9);}
for(let side of [-1,1]){let road=box(side*180,-.009,0,180,.035,12,0x626d65);road.material=streetMat;for(let zz of [-8.1,8.1])box(side*180,.025,zz,180,.12,4,0xbab7a2);}
// Zebra crossings, lowered-looking curb panels, tactile strips, continuous curb
// edges and the five guided storefront bays share two instanced draw calls.
streetConstruction=createStreetConstruction({scene,quality});
verticalTown=createVerticalTownLayer({scene,quality});colliders.push(...VERTICAL_TOWN_BARRIERS);
sign('GUMDROP TERRACE',VERTICAL_TOWN_LAYER.x,2.85,-62,5.2,'#56685d','#eadba9');
contextualStreetProps=createContextualStreetProps({scene,quality});colliders.push(...STREET_PROP_COLLIDERS);
// Three instanced batches turn the authored map/collider blocks into visible
// architecture. Five deterministic families vary mass, frontage and roofline
// while retaining the exact navigation footprints and laptop-friendly budget.
districtArchitecture=createDistrictArchitecture({scene,sites:districtBuildings,quality});
townSkyline=createTownSkyline({scene,supports:districtBuildings,quality});
junctionReveals=createJunctionReveals({scene,quality});colliders.push(...JUNCTION_REVEAL_COLLIDERS);
townUtilities=createTownUtilities({scene,supports:districtBuildings,quality});
overheadInfrastructure=createOverheadInfrastructure({scene,supports:districtBuildings,quality});
townFencing=createTownFencing({scene,supports:districtBuildings,quality});colliders.push(...TOWN_FENCE_COLLIDERS);
foregroundDepth=createForegroundDepth({scene,quality});colliders.push(...FOREGROUND_DEPTH_COLLIDERS);
domesticWorkplace=createDomesticWorkplace({scene,quality});
doorwayReveals=createDoorwayReveals({scene,quality});
windowConnections=createWindowConnections({scene,quality});
ordinaryUnusualWork=createOrdinaryUnusualWork({scene,quality});
publicServiceFronts=createPublicServiceFronts({scene,quality});
narrowAlleys=createNarrowAlleys({scene,quality});colliders.push(...NARROW_ALLEY_COLLIDERS);
shopApproaches=createShopApproaches({scene,quality});colliders.push(...SHOP_APPROACH_COLLIDERS);
logicalWear=createLogicalWear({scene,quality});
// Retire the old northern hill barrier so the avenue opens into the expanded town.
for(let o of [...scene.children])if(o.isMesh&&o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius>=15&&o.position.z< -70)scene.remove(o);
for(let [i,d]of DISTRICTS.entries()){
 cyl(d.x,1.7,d.z,.06,3.4,0x536a63);sign('BUS',d.x,3,d.z+.08,1.1,'#3f717a','#f4e7c5');addPoint('bus',d.name+' · Free town shuttle',d.x,d.z,{i});
 if(i){sign(d.name.toUpperCase(),d.x+3,2.7,d.z+1,4,'#445d55','#f1ddba');box(d.x+3,.7,d.z+1,3,.15,.65,0xa17f58);box(d.x+3,1.1,d.z+.75,3,.6,.1,0xa17f58);}
}
// Reuse existing shop systems in the outlying districts; customers and production stay saved normally.
for(let [x,z,label,type]of [[-70,-147,'Westside seeds','dealer'],[140,-147,'East Market packaging','store'],[-30,-287,'North Heights hardware','hardware'],[70,-357,'North servo ingredients','servo']]){const point=addPoint(type,label,x,z);sign(label.toUpperCase(),x,2.4,z-1,5,'#526b5b','#e9dcc0');point.actor=bobble(x,z-1.5,0x8ba7a5);}
for(let [x,z]of [[-105,-225],[105,-295],[-3,-365]]){rounded(x,1,z,.8,2,.55,0x526c63);addPoint('atm','District ATM',x,z+1);sign('ATM',x,2.35,z+.3,1.3);}
// Instancing keeps the hundreds of road markings inexpensive.
const batches=new Map();for(let o of scene.children){if(expansionStart.has(o)||!o.isMesh||o.geometry.type!=='BoxGeometry')continue;let k=o.geometry.uuid+o.material.uuid;if(!batches.has(k))batches.set(k,[]);batches.get(k).push(o);}
for(let list of batches.values()){if(list.length<3)continue;let batch=new THREE.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((o,i)=>{o.updateMatrix();batch.setMatrixAt(i,o.matrix);scene.remove(o)});batch.receiveShadow=true;batch.computeBoundingSphere();scene.add(batch);}
function travelDistrict(i){if(!DISTRICTS[i]||!DISTRICTS.some(d=>Math.hypot(player.x-d.x,player.z-d.z)<5))return;let d=DISTRICTS[i];player.set(d.x,1.72,d.z+1.5);s.x=player.x;s.z=player.z;close();resetPlayerView();save();toast('Arrived in '+d.name);}
function trackDistrict(i){let d=DISTRICTS[i];if(!d)return;track={x:d.x,z:d.z,label:d.name+' bus stop'};close();}
Object.assign(window,{travelDistrict,trackDistrict});
function paintTownMap(ctx,w,h,local=false){
 const scale=local?travelMapScale(driving):Math.min(w/740,h/700),cx=local?player.x:0,cz=local?player.z:(WORLD.minZ+95)/2;
 const center={x:cx,z:cz},pos=(x,z)=>[w/2+(x-cx)*scale,h/2+(z-cz)*scale];let visibleRoads=0,visibleBuildings=0,visibleDistricts=0,visibleContacts=0;ctx.fillStyle='#335d66';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#a39a7a';ctx.beginPath();islandShore.outline.forEach((p,i)=>{const [a,b]=pos(p.outer.x,p.outer.z);if(i)ctx.lineTo(a,b);else ctx.moveTo(a,b);});ctx.closePath();ctx.fill();
 ctx.fillStyle='#747d61';const [lx,lz]=pos(-290,WORLD.minZ-2);ctx.fillRect(lx,lz,580*scale,(WORLD.maxZ-WORLD.minZ+4)*scale);
 const road=(x,z,rw,rd)=>{if(local&&!mapRectVisible({x,z,w:rw,d:rd},center,scale,w,h))return;let [a,b]=pos(x-rw/2,z-rd/2);ctx.fillStyle='#b7b5a4';ctx.fillRect(a,b,rw*scale,rd*scale);visibleRoads++};
 road(0,0,560,12);for(let z of roadZs)road(0,z,560,12);for(let x of roadXs)road(x,-218,12,445);
 for(let b of [...buildings,...districtBuildings,...(cityExpansion?.sites||[])]){if(local&&!mapRectVisible(b,center,scale,w,h))continue;let [x,z]=pos(b.x-b.w/2,b.z-b.d/2);ctx.fillStyle='#506558';ctx.fillRect(x,z,b.w*scale,b.d*scale);visibleBuildings++;}
 for(let [i,d] of DISTRICTS.entries()){let p=local?projectMapPoint(d,center,scale,w,h,4):null;if(local&&!p)continue;let [x,z]=p?[p.x,p.y]:pos(d.x,d.z);ctx.fillStyle='#eed7a0';ctx.fillRect(x-3,z-3,6,6);visibleDistricts++;if(!local){ctx.font='bold 11px sans-serif';ctx.fillText(d.name,x+6,z-5)}else if(projectMapPoint(d,center,scale,w,h,42)){ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(d.name,x,z-7);ctx.textAlign='start';}}
 for(let c of CONTACTS){let p=local?projectMapPoint(c,center,scale,w,h,3):null;if(local&&!p)continue;let [x,z]=p?[p.x,p.y]:pos(c.x,c.z);ctx.fillStyle='#f0bd74';ctx.fillRect(x-2,z-2,4,4);visibleContacts++}
 const nearestLandmark=local?nearestTravelPoint(center,TRAVEL_LANDMARKS):null,landmarkPoint=nearestLandmark?projectMapPoint(nearestLandmark.point,center,scale,w,h,6):null;
 if(landmarkPoint){let {x,y}=landmarkPoint;ctx.fillStyle='#f6edd3';ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+5,y);ctx.lineTo(x,y+5);ctx.lineTo(x-5,y);ctx.closePath();ctx.fill();}
 let visibleParking=0;for(const bay of PARKING_BAYS){const p=local?projectMapPoint(bay,center,scale,w,h,4):null;if(local&&!p)continue;const [bx,bz]=p?[p.x,p.y]:pos(bay.x,bay.z);ctx.fillStyle='#7da8b0';ctx.fillRect(bx-4,bz-2,8,4);visibleParking++;}
 const projectedTrack=track&&local?projectMapMarker(track,center,scale,w,h,16):null;
 if(track){let [x,z]=projectedTrack?[projectedTrack.x,projectedTrack.y]:pos(track.x,track.z);ctx.strokeStyle='#ffe3a3';ctx.fillStyle='#ffe3a3';ctx.lineWidth=2;ctx.beginPath();if(projectedTrack?.offscreen){ctx.save();ctx.translate(x,z);ctx.rotate(projectedTrack.angle);ctx.moveTo(0,-10);ctx.lineTo(7,6);ctx.lineTo(0,3);ctx.lineTo(-7,6);ctx.closePath();ctx.fill();ctx.restore();}else{ctx.arc(x,z,7,0,7);ctx.stroke();}}
 let [x,z]=pos(player.x,player.z);ctx.fillStyle='#fff9dd';ctx.beginPath();ctx.arc(x,z,4,0,7);ctx.fill();
 if(net.remote&&net.connected){let p=local?projectMapPoint(net.remote,center,scale,w,h,4):null;if(!local||p){let [a,b]=p?[p.x,p.y]:pos(net.remote.x,net.remote.z);ctx.fillStyle='#7de7eb';ctx.fillRect(a-3,b-3,6,6)}}
 return {trackOffscreen:!!projectedTrack?.offscreen,landmarkVisible:!!landmarkPoint,visibleRoads,visibleBuildings,visibleDistricts,visibleContacts,visibleParking};
}
drawMap=function(){const mapState=paintTownMap(mc,334,288,true),caption=$('mapCaption');if(caption)caption.textContent=travelMapCaption({x:player.x,z:player.z,heading:driveAngle},{driving,districts:DISTRICTS,landmarks:TRAVEL_LANDMARKS,targetOffscreen:mapState.trackOffscreen});};
const districtMenu=menu;menu=function(which,data){districtMenu(which,data);if(which==='bus'){$('modal').innerHTML='<div class="overline">GUMMY BAY / FREE TOWN SHUTTLE</div>'+'<h2>Where are you heading?</h2><p>Seven stops connect the expanded town. The shuttle is free.</p>'+DISTRICTS.map((d,i)=>row(d.name,Math.round(Math.hypot(player.x-d.x,player.z-d.z))+' metres away','Travel',`travelDistrict(${i})`)).join('');}
 if(which==='map'){$('modal').innerHTML='<div class="overline">GUMMY BAY / COMPLETE TOWN MAP</div><h2>Explore the boroughs.</h2><canvas id="townOverview" width="560" height="260" style="width:100%;height:min(32vh,240px);border-radius:6px"></canvas><p>10× the original playable area. Use a bus stop for free travel.</p>'+DISTRICTS.map((d,i)=>row(d.name,'Bus stop · connected streets','Track',`trackDistrict(${i})`)).join('');paintTownMap($('townOverview').getContext('2d'),560,260);}
};window.menu=menu;
const districtUI=updateUI;updateUI=function(){districtUI();let d=DISTRICTS.reduce((a,b)=>Math.hypot(player.x-a.x,player.z-a.z)<Math.hypot(player.x-b.x,player.z-b.z)?a:b);$('district').textContent=d.name;};
// Research-led economy and customer behaviour; all products remain fictional gummies.
function atmAllowance(){let week=Math.floor((s.day-1)/7);if(s.atmWeek!==week){s.atmWeek=week;s.atmUsed=0;}return Math.max(0,10000-s.atmUsed);}
function relationship(i){return s.relations[i]||0;}
function customerMemoryHTML(brief){const r=brief.receipt;return r?'<p class="customer-memory">Last purchase: '+r.qty+' × '+esc(STRAINS[r.t].name)+' · '+cash(r.total)+' · Day '+r.day+'</p>':'';}
function customerContextHTML(i){
 const brief=customerBrief(s,i,STRAINS.length),order=brief.order;
 return '<div class="customerCard"><b>'+esc(CONTACTS[i].name)+'</b><span>Relationship '+relationship(i)+'/100</span><small>'+esc(brief.role)+'</small><p>Favourite flavour: '+esc(INGREDIENTS[i%4].effect)+'. A matching mix or a stronger relationship improves their budget.</p>'+customerMemoryHTML(brief)+(order?'<p class="customer-commitment">'+(order.missing?order.missing+' packs still needed':'Order packed and ready')+' · '+(order.minutesLeft===null?'No deadline':order.minutesLeft+' game minutes left')+'</p>':'')+'</div>';
}
function customerExchangeStatus(i){
 if(!Number.isInteger(i)||!CONTACTS[i])return {ok:false,reason:'Customer position is unavailable. Try again shortly.'};
 if(net.role==='guest'&&!net.connected)return {ok:false,reason:'Reconnect to the host before exchanging stock.'};
 if(processingRemote?net.remote?.vehicle:driving)return {ok:false,reason:'Get out of the van before handing over stock.'};
 const actor=processingRemote?{x:player.x,z:player.z,y:Number.isFinite(net.remote?.y)?net.remote.y:1.72+floorHeight(player.x,player.z)}:player;
 const recipient=net.role==='guest'&&s.npcs?.[i]?s.npcs[i]:CONTACTS[i];
 return exchangeAccess(actor,recipient,blocked,floorHeight);
}
function refreshCustomerPanel(){
 if(panel!=='customer'||!CONTACTS[selected])return;
 const status=customerExchangeStatus(selected),note=document.getElementById('customerReach');if(note)note.textContent=status.reason;
 const deal=s.deals.find(d=>d.npc===selected),deliver=document.getElementById('customerDeliver');if(deliver)deliver.disabled=!status.ok||!deal||s.packs[deal.t]<deal.qty;
 const sample=document.getElementById('customerSample'),select=document.getElementById('sampleType');if(sample)sample.disabled=!status.ok||!sampleChoices(s,selected).some(q=>q.t===Number(select?.value));
}
function customerSampleHTML(i){
 const choices=sampleChoices(s,i);
 return choices.length?'<div class="sample-choice"><label for="sampleType">Offer one unreserved sample · +10 relationship</label><div class="form"><select id="sampleType">'+choices.map(q=>'<option value="'+q.t+'">'+esc(STRAINS[q.t].name)+' · '+q.free+' available'+(q.favourite?' · favourite mix':'')+'</option>').join('')+'</select><button id="customerSample" class="ghost" '+(!customerExchangeStatus(i).ok?'disabled':'')+' onclick="action(\'sample\','+i+',Number(document.getElementById(\'sampleType\').value))">Give sample</button></div></div>':'';
}
const economyAction=doAction;doAction=function(k,a,b,c){
 if(k==='buyPackStation'){if(!s.room||s.packStation||!spend(100))return;s.packStation=true;refresh('hardware');return;}
 if(k==='buyTrimmers'){if(s.trimmers||!spend(10))return;s.trimmers=true;refresh('hardware');return;}
 if(k==='sample'){if(!CONTACTS[a]||!STRAINS[b]||!Number.isInteger(b)||s.packs[b]-reservedQty(b)<1||!customerExchangeStatus(a).ok)return;s.packs[b]--;s.relations[a]=Math.min(100,relationship(a)+10);toast(CONTACTS[a].name+': Thanks! Text me your price.');refresh('customer',a);committedExchange('sample',a,b,1);return;}
 if(k==='atmDeposit'){let allowance=atmAllowance();if(Number.isInteger(a)&&a>allowance){toast('Weekly ATM limit: '+cash(allowance)+' remaining.');return;}let before=s.bank;economyAction(k,a,b,c);s.atmUsed+=Math.max(0,s.bank-before);save();if(!processingRemote&&panel==='atm')menu('atm');return;}
 const oldSold=s.sold,oldBudget=CONTACTS[a]?.budget;
 if(k==='text'&&CONTACTS[a]&&s.listing){let item=STRAINS[s.listing.t];CONTACTS[a].budget+=relationship(a)*.0015+(item.mixed&&item.ingredient===a%4?.15:0)+cravingBudgetBonus(s.cravings?.[a],s.listing.t,s.day);}
 try{economyAction(k,a,b,c);}finally{if(oldBudget!==undefined)CONTACTS[a].budget=oldBudget;}
 if(k==='deliver'&&s.sold>oldSold){s.relations[a]=Math.min(100,relationship(a)+6);const sale=s.threads[a]?.lastSale;if(sale)recordCravingSale(a,sale.t,sale.qty);save();}
};ACTION_NAMES.push('buyPackStation','buyTrimmers','sample');
const timedAgree=agree;agree=function(i,price){timedAgree(i,price);let d=s.deals.find(d=>d.npc===i);if(d)d.due=(s.day-1)*1440+s.time+180;s.threads[i].messages.push({mine:false,text:'Meet me within three game hours. I’ll hold the agreed price.'});};
const dealProduction=production;production=function(dt){dealProduction(dt);const clock=(s.day-1)*1440+s.time;for(let d of [...s.deals])if(d.due&&clock>d.due){s.deals=s.deals.filter(x=>x!==d);s.relations[d.npc]=Math.max(0,relationship(d.npc)-5);let t=s.threads[d.npc];if(t){t.status='closed';t.messages.push({mine:false,text:'I had to leave. Text me again when you’re ready.'});}toast(CONTACTS[d.npc].name+' left. Your stock is available again.');}};
const businessMenu=menu;menu=function(which,data){if(stationTask)cancelStation();businessMenu(which,data);
 if(which==='hardware')$('modal').innerHTML+=row('Plant trimmers','Reusable tool required to harvest.',s.trimmers?'OWNED':'$10',"action('buyTrimmers')",s.trimmers||availableMoney()<10)+row('Packaging station','One-time equipment purchase. Needed to wrap gummies.',s.packStation?'OWNED':'$100',"action('buyPackStation')",s.packStation||!s.room||availableMoney()<100);
 if(which==='craft'&&!s.packStation)$('modal').innerHTML+='<p class="note">Buy a $100 packaging station at Hank’s before wrapping your first batch.</p>';
 if(which==='atm')$('modal').innerHTML+='<p class="note">Weekly deposit allowance: <b>'+cash(atmAllowance())+' / $10,000</b>. Resets every seven game days. Withdrawals do not use the allowance.</p>';
 if(which==='customer'||which==='thread'){let i=Number.isInteger(data)?data:selected;if(CONTACTS[i]){$('modal').innerHTML+=customerContextHTML(i);if(which==='customer')$('modal').innerHTML+='<p id="customerReach" class="note" role="status">'+esc(customerExchangeStatus(i).reason)+'</p>'+customerSampleHTML(i);}}
 if(which==='journal')$('modal').innerHTML+='<h3>Equipment budget</h3><p>Room $75 · tent $100 · can $15 · soil $10 · first seed $30 · trimmers $10 · packaging station $100 · 10 wrappers $10. Total $350, leaving $50 from your $400 start.</p><p>Space: jump · Ctrl: crouch · Shift: sprint. At workstations, follow the hands-on steps. Escape cancels without using supplies.</p>';
 if(which==='settings')$('modal').innerHTML+='<button class="ghost" onclick="toggleSound()">'+(soundEnabled?'Mute':'Enable')+' sound effects</button><p class="note">Space jumps. Hold Ctrl to crouch. Walking accelerates and brakes smoothly.</p>';
};window.menu=menu;
// A close-up 3D bench is shared by manual station actions. Stock commits only on completion.
let stationTask=null,stationHeld=false;
const stationView=new THREE.Group();camera.add(stationView);stationView.visible=false;
rounded(0,-.46,-1.05,1.26,.08,.65,0x9c8765,stationView);rounded(0,-.4,-1.04,.78,.035,.49,0xd7d5b9,stationView);
const stationPiece=rounded(-.18,-.32,-1.04,.22,.14,.22,0x98bd64,stationView),stationWrapper=rounded(.23,-.37,-1.04,.28,.02,.33,0xe4d6a9,stationView);
const stationTool=new THREE.Group();stationTool.position.set(.3,-.1,-1.05);stationView.add(stationTool);rounded(0,0,0,.13,.24,.13,0x739b91,stationTool);cyl(-.08,-.02,-.04,.025,.18,0xc0cbbd,stationTool).rotation.z=-.6;
stationView.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;o.material=o.material.clone();o.material.depthTest=false;o.renderOrder=50;}});
const MANUAL={prepare:[['Hold to pour soil','hold',1.2],['Drag to level the soil','drag',180]],plant:[['Click to place the seed','tap',1],['Drag to cover it','drag',120]],water:[['Hold to pour water','hold',1.8]],fill:[['Hold to fill the can','hold',1.4]],harvest:[['Click to collect four clusters','tap',4]],make:[['Drag to shape the gummy','drag',240],['Click to set it on the tray','tap',1]],pack:[['Drag the gummy into its wrapper','drag',180],['Hold to seal the pack','hold',.9]],mix:[['Click to add your flavouring','tap',1],['Drag to stir the mixture','drag',300],['Hold to pour into the mould','hold',1.1]]};
function manualReady(k,a,b){
 if(!s.room)return false;
 if(k==='prepare')return s.installed?.includes(a)&&!s.plants[a]&&s.soil>0;
 if(k==='plant')return s.plants[a]?.phase==='soil'&&s.seeds[b]>0;
 if(k==='water')return s.can&&s.water>0&&['dry','thirsty'].includes(s.plants[a]?.phase);
 if(k==='fill')return s.can&&s.water<6;
 if(k==='harvest')return s.trimmers&&s.plants[a]?.phase==='mature';
 if(k==='make')return s.raw[a]>0;
 if(k==='pack')return s.packStation&&s.gummies[a]>0&&s.wrappers>0;
 if(k==='mix')return s.mixer&&s.ingredients[b]>0&&(s.gummies[a]>0||s.packs[a]>reservedQty(a));return false;
}
function paintStation(){if(!stationTask)return;let task=stationTask,step=MANUAL[task.k][task.step];$('stationHUD').innerHTML='<div class="overline">'+task.k.toUpperCase()+' / STEP '+(task.step+1)+' OF '+MANUAL[task.k].length+'</div><h2>'+step[0]+'</h2><p>'+(step[1]==='drag'?'Hold the mouse button and move across the work surface.':step[1]==='hold'?'Hold the mouse button over the work surface.':'Click the work surface '+step[2]+' time'+(step[2]>1?'s.':'.'))+'</p><div class="progress"><div style="width:'+Math.min(100,task.progress/step[2]*100)+'%"></div></div><button onclick="cancelStation()">Cancel [Esc]</button>';}
function cancelStation(){if(stationTask?.viewBefore){yaw=stationTask.viewBefore.yaw;pitch=stationTask.viewBefore.pitch;camera.rotation.set(pitch,yaw,0,'YXZ');}stationTask=null;stationHeld=false;stationView.visible=false;$('stationHUD').hidden=true;panel='';}
const stationClose=close;close=function(){if(stationTask)cancelStation();locomotion.x=locomotion.z=0;stationClose();};window.closeMenu=close;window.cancelStation=cancelStation;
const commitAction=action;action=function(k,a,b,c){if(stationTask||work||!active)return;if(MANUAL[k]){if(!manualReady(k,a,b))return;let type=['prepare','plant','water','harvest'].includes(k)?'tent':k==='fill'?'sink':k==='mix'?'mix':'craft';let p=points.find(p=>p.type===type&&pointVisible(p)&&(type!=='tent'||p.i===a));if(!p||Math.hypot(player.x-p.x,player.z-p.z)>5){toast('Walk to your '+type+' station first.');return;}close();panel='station';stationTask={k,a,b,c,step:0,progress:0,elapsed:0,gesture:{},viewBefore:{yaw,pitch}};if(comfort.stationFocus&&['craft','mix'].includes(type)){camera.lookAt(p.x,1.4,p.z-(type==='craft'?2:1.4));yaw=camera.rotation.y;pitch=camera.rotation.x;}stationView.visible=true;stationPiece.material.color.set(STRAINS[k==='plant'?b:s.plants[a]?.t??a]?.color||0x98bd64);$('stationHUD').hidden=false;paintStation();return;}commitAction(k,a,b,c);};window.action=action;
function advanceStation(amount){if(!stationTask)return;const t=stationTask,step=MANUAL[t.k][t.step];t.progress+=amount;if(t.progress>=step[2]){t.step++;t.progress=0;t.elapsed=0;t.gesture={};stationHeld=false;stationAssist=false;if(t.step>=MANUAL[t.k].length){const args=[t.k,t.a,t.b,t.c];cancelStation();if(ensurePolice().search){toast('Police search interrupted the task. Nothing was consumed.');return;}const access=physicalActionAccess(args[0],args[1]);if(access&&!access.ok){toast(access.reason);return;}commitAction(...args);if(net.role!=='guest'){work=null;$('work').style.display='none';watering.visible=false;save();}playTone(620,.08,.025);return;}}paintStation();}
canvas.addEventListener('pointerdown',e=>{if(!stationTask||document.hidden||e.isPrimary===false||(e.button!==undefined&&e.button!==0))return;stationTask.pointer=workSurfaceMotion(e,null,document.pointerLockElement===canvas).point;if(document.pointerLockElement!==canvas)canvas.setPointerCapture?.(e.pointerId);if(isTimedSeal()){pressSeal();return;}stationHeld=true;const step=MANUAL[stationTask.k][stationTask.step];if(step[1]==='tap')advanceStation(1);});
addEventListener('pointerup',()=>stationHeld=false);addEventListener('blur',()=>stationHeld=false);
addEventListener('pointermove',e=>{if(!stationTask||!stationHeld||document.hidden||e.isPrimary===false)return;let step=MANUAL[stationTask.k][stationTask.step];if(step[1]==='drag'){const motion=workSurfaceMotion(e,stationTask.pointer,document.pointerLockElement===canvas);stationTask.pointer=motion.point;advanceStation(gestureCredit(stationTask.k,motion.dx,motion.dy,stationTask.gesture));}});
// Original synthesized feedback, unlocked by a user gesture.
let soundEnabled=true,audioContext=null,footstepAt=0;
function playTone(hz,duration,volume){if(!soundEnabled||!audioContext)return;try{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.setValueAtTime(hz,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(30,hz*.45),audioContext.currentTime+duration);g.gain.setValueAtTime(volume,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration);}catch(e){}}
addEventListener('pointerdown',()=>{const AC=window.AudioContext||window.webkitAudioContext;if(AC&&!audioContext)audioContext=new AC();audioContext?.resume();});
function toggleSound(){soundEnabled=!soundEnabled;menu('settings')}window.toggleSound=toggleSound;
let feelLast=performance.now();const feelRender=renderFrame;renderFrame=function(){let t=performance.now(),dt=Math.min(.06,(t-feelLast)/1000);feelLast=t;
 if(active&&!panel&&walk&&locomotion.jump===0&&now-footstepAt>(keys.shift?.28:.46)){footstepAt=now;playFootstep();}feelRender();};
const sightUI=updateUI;updateUI=function(){sightUI();if(stationTask){$('prompt').style.display='none';return;}if(near){let dx=near.x-player.x,dz=near.z-player.z,d=Math.hypot(dx,dz);if(d>1.2&&(-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/d<.4){near=null;$('prompt').style.display='none';}}};
// Saved layouts and physical equipment placement.
const HOMES=[{x:-25,z:40,w:18,d:17},{x:-54,z:55,w:24,d:20},{x:54,z:51,w:27,d:22}];
function tentSupportHeight(x,z,ceiling=false){
 let height=ceiling?Infinity:0;
 if(!active||!s.room)return height;
 const origin=tentOrigins[s.house],limit=Math.min(8,s.tents,maxTents());
 for(let i=0;i<limit;i++){
  if(!s.installed?.includes(i))continue;
  const p=s.layout?.[s.house+':'+i],tx=Number.isFinite(p?.x)?p.x:origin.x+(i%4)*3.3,tz=Number.isFinite(p?.z)?p.z:origin.z+Math.floor(i/4)*5.8,angle=Number.isFinite(p?.r)?p.r:0;
  const h=ceiling?tentCeilingHeight(x,z,tx,tz,angle):tentFloorHeight(x,z,tx,tz,angle);
  height=ceiling?Math.min(height,h):Math.max(height,h);
 }
 return height;
}
function floorHeight(x,z){return Math.max(rvFloorHeight(x,z),tentSupportHeight(x,z),verticalTownFloorHeight(x,z),terrainHeight(x,z));}
function propFloorHeight(x,z){return Math.max(floorHeight(x,z),townPropFloorHeight(x,z));}
function ceilingHeight(x,z){return Math.min(rvCeilingHeight(x,z),tentSupportHeight(x,z,true));}
function propOverheadBands(x,z){
 let bands=rvPropBands(x,z);
 if(!active||!s.room)return bands;
 const origin=tentOrigins[s.house],limit=Math.min(8,s.tents,maxTents());
 for(let i=0;i<limit;i++){
  if(!s.installed?.includes(i))continue;
  const p=s.layout?.[s.house+':'+i],tx=Number.isFinite(p?.x)?p.x:origin.x+(i%4)*3.3,tz=Number.isFinite(p?.z)?p.z:origin.z+Math.floor(i/4)*5.8;
  const extra=tentPropBands(x,z,tx,tz,Number.isFinite(p?.r)?p.r:0);if(extra.length)bands=[...bands,...extra];
 }
 return bands;
}
// Physical/network eye excludes cosmetic bob; the camera alone receives bob.
function syncPlayerView(){
 const ground=floorHeight(player.x,player.z);
 if(!driving)Object.assign(locomotion,limitPlayerJump({ground,crouch:locomotion.crouch,jump:locomotion.jump,vertical:locomotion.vertical,ceiling:ceilingHeight(player.x,player.z)}));
 const bob=headBob(walkPhase,Math.hypot(locomotion.x,locomotion.z),{crouch:locomotion.crouch,airborne:locomotion.jump>0,moving:walk&&!driving,amount:comfort.bob?bobAmount:0,sprinting:Math.hypot(locomotion.x,locomotion.z)>SPRINT_SPEED*.85});locomotion.roll=comfort.bob&&!panel?bob.roll:0;const pose=playerViewHeights({ground,crouch:locomotion.crouch,jump:locomotion.jump,driving,bob:comfort.bob&&!panel?(locomotion.jump>0?locomotion.dip||0:bob.y+(locomotion.dip||0)):0});
 player.y=pose.eye;const side=comfort.bob&&!panel?bob.lateral:0;camera.position.set(player.x+Math.cos(yaw)*side,pose.cameraEye+(driving?0:(locomotion.stepEye||0)),player.z-Math.sin(yaw)*side);
}
function resetPlayerView(){
 if(active&&!driving){const safe=escapeFurniture(player,furnishings.filter(colliderEnabled),blocked);if(safe){player.x=safe.x;player.z=safe.z;}recoverTentPlayer();settleSpawn();}
 Object.assign(locomotion,{x:0,z:0,jump:0,vertical:0,crouch:0,space:false,jumpQueued:0,roll:0,coyote:.1,airSpeed:0,regenWait:0,dip:0,stepEye:0,lastGround:null});walk=false;walkPhase=0;clearExchangeGesture();hand.position.y=0;watering.rotation.z=0;
 camera.fov=fovBase;camera.updateProjectionMatrix();syncPlayerView();camera.rotation.set(pitch,yaw,0,'YXZ');hand.visible=active&&!panel&&!stationTask&&!driving&&!placeMode;
}
let placeMode=null;
const placeGhost=new THREE.Mesh(new THREE.BoxGeometry(2.4,2.3,2.4),new THREE.MeshBasicMaterial({color:0x92d991,wireframe:true,transparent:true,opacity:.8}));placeGhost.visible=false;scene.add(placeGhost);
function placementValid(i,p){const h=HOMES[s.house];if(!p||p.home!==s.house||![p.x,p.z,p.r].every(Number.isFinite)||Math.abs(p.x-h.x)>h.w/2-1.5||Math.abs(p.z-h.z)>h.d/2-1.5)return false;
 if(Math.abs(p.x-h.x)<2.3&&p.z>h.z+h.d/2-3.8)return false;
 const cosine=Math.cos(p.r),sine=Math.sin(p.r);for(let dx of [-1.25,0,1.25])for(let dz of [-1.25,0,1.25])if(staticBlocked(p.x+dx*cosine+dz*sine,p.z-dx*sine+dz*cosine))return false;
 for(let j of s.installed||[])if(j!==i&&j<maxTents()){let o=tents[j].position;if(Math.abs(o.x-p.x)<2.7&&Math.abs(o.z-p.z)<2.7)return false;}return true;
}
const fixedBase=refreshBase;refreshBase=function(){fixedBase();tents.forEach((g,i)=>{let p=s.layout[s.house+':'+i];g.rotation.y=p?.r||0;if(p&&Number.isFinite(p.x)&&Number.isFinite(p.z))g.position.set(p.x,0,p.z);let point=points.find(p=>p.type==='tent'&&p.i===i);point.x=g.position.x+Math.sin(g.rotation.y)*1.6;point.z=g.position.z+Math.cos(g.rotation.y)*1.6;});};
function beginPlacement(i){if(!s.installed?.includes(i)||stationTask||driving)return;close();placeMode={i,r:tents[i].rotation.y};placeGhost.visible=true;$('placementHUD').hidden=false;$('placementStatus').textContent='Aim inside your property to check access.';$('placementConfirm').disabled=true;}
function cancelPlacement(){placeMode=null;placeGhost.visible=false;$('placementHUD').hidden=true;$('placementConfirm').disabled=true;}
function confirmPlacement(){if(!placeMode)return;let p={x:placeGhost.position.x,z:placeGhost.position.z,r:placeMode.r,home:s.house};if(!placementValid(placeMode.i,p)){toast(placementFailure||'Keep the tent inside your property, clear of walls, furniture and the doorway.');return;}let i=placeMode.i;cancelPlacement();action('placeTent',i,p);}
Object.assign(window,{beginPlacement,cancelPlacement,confirmPlacement});
// Stock rooms provide persistent storage separate from listed/carried packs.
for(let [home,h]of HOMES.entries()){let x=h.x,z=h.z+4;for(let y of [.35,1,1.65])box(x-1.8,y,z,1.2,.09,.8,0xa28d68);for(let xx of [x-2.35,x-1.25])box(xx,1,z,.07,2,.8,0x586c61);addFurnishing('stockrack',x-1.8,z,1.2,.8,home);addPoint('stockroom','Stockroom · Store or collect packs',x,z,{home});}
const storagePointVisible=pointVisible;pointVisible=function(p){if(p.type==='staffboard')return s.room&&p.home===s.house;if(p.type==='stockroom')return s.room&&p.home===s.house;return storagePointVisible(p)};
function atStockroom(){return points.some(p=>p.type==='stockroom'&&pointVisible(p)&&Math.hypot(player.x-p.x,player.z-p.z)<4);}
const systemsAction=doAction;doAction=function(k,a,b,c){
 if(k==='placeTent'){if(!s.installed?.includes(a)||!placementValid(a,b))return;s.layout[s.house+':'+a]={x:b.x,z:b.z,r:b.r,home:b.home};refreshBase();save();toast('Tent repositioned. Its current crop is preserved.');return;}
 if(k==='stash'||k==='unstash'){if(!atStockroom()||!Number.isInteger(a)||!STRAINS[a]||!Number.isInteger(b)||b<1||b>10000)return;let from=k==='stash'?s.packs:s.storedPacks,to=k==='stash'?s.storedPacks:s.packs;let free=from[a]-(k==='stash'?reservedQty(a):0);if(free<b)return;from[a]-=b;to[a]+=b;save();if(!processingRemote)menu('stockroom');return;}
 if(k==='worker'){if(!['gardener','crafter','seller'].includes(a)||!s.helpers[a])return;s.workerEnabled[a]=!s.workerEnabled[a];save();if(!processingRemote)menu(panel==='staffboard'?'staffboard':'helpers');return;}
 if(k==='buyVehicle'){if(s.vehicleOwned||level()<2||!spend(750))return;s.vehicleOwned=true;save();if(!processingRemote)menu('garage');return;}
 systemsAction(k,a,b,c);
};ACTION_NAMES.push('placeTent','stash','unstash','worker','buyVehicle');
// A fleet unlock gives each co-op player a delivery van; host parking is persisted.
let carDrive=null,carDriveTop=0,driving=false,driveSpeed=0,driveSteer=0,driveFovNow=FOV_BASE,driveAngle=0,vehiclePose={x:-180,z:-155,angle:0};
const playerVan=car(-180,-155,0x638e96),remoteVan=car(0,0,0x9c966c);playerVan.visible=remoteVan.visible=false;
for(const van of [playerVan,remoteVan])attachObjectSilhouette(van,'van');
if(typeof GLTFLoader!=='undefined')new GLTFLoader().load('./assets/delivery-van.glb',gltf=>{for(let van of [playerVan,remoteVan]){van.clear();const body=gltf.scene.clone(true);body.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});van.add(body);attachObjectSilhouette(van,'van',{quality});}},undefined,e=>console.warn('Using fallback delivery van',e));
const vanPoint=addPoint('vehicle','Delivery van · Drive / manage',-180,-153);
addPoint('garage','Harbor Motors · Delivery fleet',-180,-150);sign('HARBOR MOTORS',-180,3,-148,7,'#426770','#e9d9af');
function vehicleClear(x,z,angle){for(let forward of [-1.6,0,1.6])for(let side of [-.9,.9]){let xx=x+Math.sin(angle)*forward+Math.cos(angle)*side,zz=z+Math.cos(angle)*forward-Math.sin(angle)*side;if(blocked(xx,zz))return false;}return true;}
function entryDoor(){return vehicleDoorAccess(vehiclePose,player,blocked,floorHeight);}
function enterVehicle(){if(!active||!s.vehicleOwned||driving)return;if(ensurePolice().search?.role===localPoliceRole()){toast('Wait until your police search finishes.');return;}if(!entryDoor()){toast('Approach a clear side door on level ground to enter the van.');return;}close();driving=true;driveSpeed=0;driveSteer=0;driveFovNow=camera.fov;driveAngle=vehiclePose.angle;player.set(vehiclePose.x,1.72+floorHeight(vehiclePose.x,vehiclePose.z),vehiclePose.z);locomotion.x=locomotion.z=0;yaw=driveAngle+Math.PI;resetPlayerView();toast('W accelerate · S brake / reverse · A/D steer · F exit · Space handbrake');}
function exitVehicle(){if(!driving)return;if(ensurePolice().search?.role===localPoliceRole()){toast('Wait until your police search finishes.');return;}if(Math.abs(driveSpeed)>1){toast('Stop the van before getting out.');return;}const current={x:player.x,z:player.z,angle:driveAngle},snap=parkingSnapPose(current,driveSpeed),parked=snap&&vehicleSweep(snap.x,snap.z,snap.angle)&&vehicleClear(snap.x,snap.z,snap.angle)?snap:current,door=vehicleDoorAccess(parked,null,blocked,floorHeight);if(door){driving=false;vehiclePose={x:parked.x,z:parked.z,angle:parked.angle};player.set(door.x,1.72+floorHeight(door.x,door.z),door.z);driveSpeed=0;locomotion.x=locomotion.z=0;resetPlayerView();if(net.role!=='guest')s.vehiclePark={...vehiclePose};save();if(snap&&parked===snap)toast('Parked at '+snap.label+'. Storefront access remains open.');return;}toast('Both doors are blocked. Move the van into an open area.');}
Object.assign(window,{enterVehicle,exitVehicle});
const vehiclePacket=playerPacket;playerPacket=function(){return {...vehiclePacket(),vehicle:driving,vehicleAngle:driveAngle};};
function resetSystems(){balanceFeedback.reset();if(typeof physicalCrafter!=='undefined'){physicalCrafter.home=-1;physicalCrafter.progress=0;physicalCrafter.path=null;}driving=false;driveSpeed=0;vehiclePose={...s.vehiclePark};driveAngle=vehiclePose.angle||0;cancelPlacement();CONTACTS.forEach((c,i)=>{let p=s.npcs[i]||customerHomes[i];c.x=p.x;c.z=p.z;people[i].position.set(c.x,0,c.z);});stamina=100;resetPlayerView();}
const systemsLoad=load;load=function(...args){systemsLoad(...args);resetSystems();};window.loadGame=load;
// Customer routes are deterministic, host-simulated and shared with guests.
const customerHomes=CONTACTS.map(c=>({x:c.x,z:c.z}));
function planForResident(i){return residentPlan(i,s.time,customerHomes[i],s.deals.some(d=>d.npc===i));}
function residentStatus(i){return residentDescription(planForResident(i),CONTACTS[i],!!s.npcs[i]?.routeBlocked);}
function updateCustomers(dt){for(let i=0;i<CONTACTS.length;i++){const c=CONTACTS[i],g=people[i],oldX=c.x,oldZ=c.z;
 if(net.role==='guest'){let p=s.npcs[i];if(p&&Number.isFinite(p.x)&&Number.isFinite(p.z)){c.x+=(p.x-c.x)*Math.min(1,dt*10);c.z+=(p.z-c.z)*Math.min(1,dt*10);}}
 else{const target=residentPlan(i,s.time,customerHomes[i],s.deals.some(d=>d.npc===i));const status=moveCustomerTo(c,i,target,dt);s.npcs[i]={x:c.x,z:c.z,routeBlocked:status==='blocked'};}
 let moving=Math.hypot(c.x-oldX,c.z-oldZ)>.0001;g.position.set(c.x,0,c.z);if(moving)g.rotation.y=turnTowards(g.rotation.y,Math.atan2(c.x-oldX,c.z-oldZ),dt);else if(Math.hypot(player.x-c.x,player.z-c.z)<3.5)g.rotation.y=turnTowards(g.rotation.y,Math.atan2(player.x-c.x,player.z-c.z),dt,5);g.userData.walking=moving;let p=points.find(p=>p.type==='customer'&&p.i===i);p.x=c.x;p.z=c.z;for(let [j,leg]of (g.userData.legs||[]).entries())leg.rotation.x=moving?Math.sin(now*7+j*Math.PI)*.35:0;
 if(track?.npc===i){track=projectTrackedCustomer(track,CONTACTS,{guest:net.role==='guest',connected:net.connected,moving,blocked:!!s.npcs[i]?.routeBlocked});if(track&&Math.hypot(player.x-c.x,player.z-c.z)<=2.8&&customerExchangeStatus(i).ok){toast('You found '+c.name+'.');track=null;}}}
}
const systemsUpdate=update;update=function(dt){const operating=active&&!panel;if(driving&&operating){let input=keys;keys={};locomotion.x=locomotion.z=0;systemsUpdate(dt);keys=input;
 const vehicleSpec=carDrive&&carDriveTop?{...activeFleet(s),top:carDriveTop}:activeFleet(s);if(carDrive)carDrive(input,dt);else{let throttle=(input.w?1:0)-(input.s?1:0);driveSpeed+=throttle*dt*vehicleSpec.acceleration;if(!throttle)driveSpeed*=Math.exp(-dt*1.8);if(input[' '])driveSpeed*=Math.exp(-dt*9);driveSpeed=Math.max(-vehicleSpec.reverse,Math.min(vehicleSpec.top,driveSpeed));driveSteer=steerStep(driveSteer,(input.a?1:0)-(input.d?1:0),dt);let steering=driveSteer,nextAngle=driveAngle+steering*dt*driveYawRate(vehicleSpec.steering,driveSpeed,vehicleSpec.top)*Math.sign(driveSpeed||1);if(vehicleClear(player.x,player.z,nextAngle))driveAngle=nextAngle;
 const surface=drivingSurfaceZone({x:player.x,z:player.z,angle:driveAngle});driveSpeed=limitVehicleZoneSpeed(driveSpeed,surface,dt);
 let nx=player.x+Math.sin(driveAngle)*driveSpeed*dt,nz=player.z+Math.cos(driveAngle)*driveSpeed*dt;if(vehicleSweep(nx,nz,driveAngle)){player.x=nx;player.z=nz;}else{driveSpeed=0;playTone(60,.12,.03);}}vehiclePose={x:player.x,z:player.z,angle:driveAngle};if(net.role!=='guest')s.vehiclePark={...vehiclePose};yaw=driveAngle+Math.PI;syncPlayerView();camera.rotation.set(pitch,yaw,0);hand.visible=false;driveFovNow+=(driveFov(fovBase,driveSpeed,vehicleSpec.top,comfort.sprintFov)-driveFovNow)*(1-Math.exp(-Math.min(.1,dt)*FOV_RESPONSE));camera.fov=driveFovNow;camera.updateProjectionMatrix();
 }else{systemsUpdate(dt);hand.visible=active&&!driving&&!stationTask&&!panel&&!placeMode;}
 if(operating)updateCustomers(dt);
 if(placeMode){placeGhost.position.set(Math.round((player.x-Math.sin(yaw)*3)*2)/2,1.15,Math.round((player.z-Math.cos(yaw)*3)*2)/2);placeGhost.rotation.y=placeMode.r;const valid=placementValid(placeMode.i,{x:placeGhost.position.x,z:placeGhost.position.z,r:placeMode.r,home:s.house});placeGhost.material.color.set(valid?0x8bdb94:0xe58e74);const status=valid?'Access clear — tent entrances, stations and exit remain reachable.':placementFailure;$('placementConfirm').disabled=!valid;if($('placementStatus').textContent!==status)$('placementStatus').textContent=status;}
 playerVan.visible=s.vehicleOwned&&!driving;playerVan.position.set(vehiclePose.x,terrainHeight(vehiclePose.x,vehiclePose.z),vehiclePose.z);playerVan.rotation.y=vehiclePose.angle;vanPoint.x=vehiclePose.x;vanPoint.z=vehiclePose.z+2.5;
 remoteVan.visible=!!(net.connected&&net.remote?.vehicle);if(remoteVan.visible){remoteVan.position.lerp(new THREE.Vector3(net.remote.x,terrainHeight(net.remote.x,net.remote.z),net.remote.z),Math.min(1,dt*10));remoteVan.rotation.y=net.remote.vehicleAngle||0;if(other)other.visible=false;}
 const travel=travelReading({x:player.x,z:player.z,heading:driveAngle},{districts:DISTRICTS,landmarks:TRAVEL_LANDMARKS,target:track});
 const junctionView=nearestJunctionReveal({x:player.x,z:player.z},JUNCTION_REVEAL_PROFILES),junctionLine=junctionView?'JUNCTION VIEW · '+junctionView.label.toUpperCase()+' · '+junctionView.stage.toUpperCase()+' '+junctionView.direction.toUpperCase():'';
 const targetKind=Number.isInteger(track?.npc)?'CUSTOMER':'TRACKED',targetStatus=track?.status?' · '+track.status:'';
 const destination=travel.target?targetKind+' · '+travel.target.label+' · '+formatTravelDistance(travel.target.distance)+' · '+travel.target.cue+targetStatus:'NEAR · '+travel.landmark.label+' · '+formatTravelDistance(travel.landmark.distance);
 const districtLabel=travel.district.toUpperCase()+(travel.districtNeighbor?' · '+travel.districtNeighbor.toUpperCase()+' BORDER':'');
 const surface=drivingSurfaceZone({x:player.x,z:player.z,angle:driveAngle}),parking=parkingGuide({x:player.x,z:player.z,angle:driveAngle},driveSpeed);
 $('drivingHUD').hidden=!driving;$('drivingHUD').textContent=Math.round(Math.abs(driveSpeed)*3.6)+' km/h · '+districtLabel+' · heading '+travel.heading+'\n'+roadZoneLine(surface)+'\n'+parkingGuideLine(parking)+(junctionLine?'\n'+junctionLine:'')+'\n'+destination+'\nW/S drive · A/D steer · Space handbrake · V camera · T trunk · M map · F exit';
};
addEventListener('keydown',e=>{if(!active||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(e.key.toLowerCase()==='f'&&!panel&&!e.repeat){driving?exitVehicle():enterVehicle();}if(placeMode){if(e.key.toLowerCase()==='r')placeMode.r+=Math.PI/2;if(e.key==='Enter')confirmPlacement();if(e.key==='Escape')cancelPlacement();}});
const systemsMenu=menu;menu=function(which,data){if(placeMode)cancelPlacement();systemsMenu(which,data);if(which==='tent'&&s.installed?.includes(selected))$('modal').innerHTML+='<button class="ghost" onclick="beginPlacement('+selected+')">Move / rotate this tent</button>';
 if(which==='stockroom'){$('modal').innerHTML='<div class="overline">PROPERTY / STOCKROOM</div><h2>Keep your stock organised.</h2><p>Stored packs cannot be promised to customers until you collect them. Reserved delivery stock stays in your bag.</p>';STRAINS.forEach((t,i)=>{if(!s.packs[i]&&!s.storedPacks[i])return;$('modal').innerHTML+=row(t.name,s.packs[i]+' carried · '+s.storedPacks[i]+' stored','Store 1',`action('stash',${i},1)`,s.packs[i]<=reservedQty(i))+row('Collect '+t.name,'Bring one pack back to your bag.','Collect 1',`action('unstash',${i},1)`,s.storedPacks[i]<1);});}
 // Pause and assignment controls are shared with the workshop roster below.
 if(which==='garage'||which==='vehicle'){$('modal').innerHTML='<div class="overline">HARBOR MOTORS / ELECTRIC DELIVERIES</div><h2>A little van. A bigger business.</h2><p>Fleet unlock: $750 at level 2. Each co-op player can drive a van. W/S accelerate and brake, A/D steer, Space handbrake, F enter or exit. Stop before exiting.</p>'+row('Delivery van fleet','Buy once. No fuel charge.',s.vehicleOwned?'OWNED':level()<2?'LEVEL 2':'$750',"action('buyVehicle')",s.vehicleOwned||level()<2||availableMoney()<750);if(s.vehicleOwned)$('modal').innerHTML+=row('Your delivery van','Approach a clear side door on level ground.','Drive','enterVehicle()',!entryDoor());}
 if(which==='map')$('modal').innerHTML+=row('Harbor Motors','Westside · delivery vehicle fleet','Track',"trackPlace('garage')");
};window.menu=menu;
const systemsAct=act;act=function(){if(placeMode){confirmPlacement();return;}if(driving){exitVehicle();return;}systemsAct();};window.act=act;
const vanVisible=pointVisible;pointVisible=function(p){if(p.type==='vehicle')return s.vehicleOwned&&!driving;return vanVisible(p)};

const systemsRender=renderFrame;renderFrame=function(){if(other&&net.remote?.vehicle)other.visible=false;systemsRender();};// Shared movable props: host simulates gravity, bounce and wall collisions.
const propSpawns=[{x:13,z:-82},{x:-13,z:-82},{x:13,z:-150},{x:-108,z:-153}];
const propMeshes=propSpawns.map((p,i)=>{let g=new THREE.Group();scene.add(g);rounded(0,0,0,.58,.56,.58,0xa48d65,g);box(0,.285,0,.1,.015,.59,0xd1c097,false,g);addPoint('prop','Parcel crate · Pick up',p.x,p.z,{i});return g;});
function ensureProps(){s.props??=propSpawns.map(p=>({...p,y:PROP_RADIUS,vx:0,vy:0,vz:0,owner:null,rx:0,ry:0,rz:0,wx:0,wy:0,wz:0}));}
const propsAction=doAction;doAction=function(k,a,b,c){
 if(k==='grabProp'){ensureProps();let p=s.props[a],owner=processingRemote?'guest':'host';if(!Number.isInteger(a)||!p||p.owner||s.props.some(p=>p.owner===owner)||!propReachable(player,p,blocked,3,propOverheadBands))return;p.owner=owner;p.vx=p.vy=p.vz=0;s.parcelNotes??={};const discovered=!s.parcelNotes[a];s.parcelNotes[a]=true;if(discovered&&!processingRemote)toast('Shipping note found: '+PARCEL_NOTES[a%PARCEL_NOTES.length].title+' · read it in your notebook');if(!processingRemote){if(panel==='prop')close();playTone(135,.06,.012*audioLevels.master*audioLevels.effects);}save();return;}
 if(k==='throwProp'||k==='dropProp'){ensureProps();let owner=processingRemote?'guest':'host',p=s.props.find(p=>p.owner===owner);if(!p)return;let facing=processingRemote?net.remote?.yaw:yaw;if(!Number.isFinite(facing))return;p.owner=null;Object.assign(p,parcelVelocity(facing,processingRemote?net.remote?.pitch:pitch,k==='dropProp'));Object.assign(p,propThrowSpin(facing,k==='dropProp'));if(!processingRemote&&panel==='prop')close();save();return;}
 propsAction(k,a,b,c);
};ACTION_NAMES.push('grabProp','throwProp','dropProp');
const propsMenu=menu;menu=function(which,data){propsMenu(which,data);if(which==='prop'){
 ensureProps();const index=Number.isInteger(data)?data:-1,p=s.props[index],owner=net.role==='guest'?'guest':'host',held=p?.owner===owner,reachable=p&&!p.owner&&propReachable(player,p,blocked,3,propOverheadBands);
 $('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Close">×</button><div class="overline">PHYSICAL PROP</div><h2>Parcel crate</h2><p>An empty reusable crate, separate from your business stock. G throws a carried crate; Shift+G sets it down gently. Walls block grabbing and carrying.</p><p class="note">'+(held?'You are carrying this crate.':p?.owner?'Your friend is carrying this crate.':reachable?'Within reach, with a clear path.':'Move closer with a clear path — maximum reach is 3 metres.')+'</p>'+(held?'<button class="primary" onclick="action(\'dropProp\')">Set down gently</button>':'<button class="primary" onclick="action(\'grabProp\','+index+')" '+(reachable?'':'disabled')+'>Pick up</button>');
}};window.menu=menu;
addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='g'||e.repeat||!active||panel||driving||work||placeMode)return;ensureProps();let owner=net.role==='guest'?'guest':'host';if(s.props.some(p=>p.owner===owner)){action(e.shiftKey?'dropProp':'throwProp');return;}const i=chooseParcel(s.props,player,yaw,pitch,p=>propReachable(player,p,blocked,3,propOverheadBands));if(i>=0)action('grabProp',i);});
const propsUpdate=update;update=function(dt){propsUpdate(dt);ensureProps();const advance=active&&!panel&&net.role!=='guest';
 if(advance&&Number.isFinite(dt)&&dt>0){const frame=Math.min(.06,dt),fastest=Math.max(0,...s.props.map(p=>Math.hypot(Number.isFinite(p.vx)?p.vx:0,Number.isFinite(p.vy)?p.vy:0,Number.isFinite(p.vz)?p.vz:0))),steps=Math.max(1,Math.min(8,Math.ceil(fastest*frame/.08))),slice=frame/steps;
  for(let step=0;step<steps;step++){s.props.forEach(p=>{const holder=p.owner==='guest'?(net.connected?net.remote:null):p.owner==='host'?{x:player.x,y:player.y,z:player.z,yaw,pitch}:null;Object.assign(p,stepProp(p,slice,{blocked:propBlocked,reachBlocked:blocked,floorHeight:propFloorHeight,holder,overheadBands:propOverheadBands}));});const resolved=resolvePropPairs(s.props,{blocked:propBlocked});resolved.forEach((p,i)=>Object.assign(s.props[i],p));}}
 s.props.forEach((p,i)=>{if(!propMeshes[i])return;const rx=Number.isFinite(p.rx)?p.rx:0,ry=Number.isFinite(p.ry)?p.ry:0,rz=Number.isFinite(p.rz)?p.rz:0;propMeshes[i].position.set(p.x,p.y+propVisualLift(rx,ry,rz),p.z);propMeshes[i].rotation.set(rx,ry,rz);let point=points.find(q=>q.type==='prop'&&q.i===i);point.x=p.x;point.z=p.z;});};

// Fictional gummy enforcement. Host owns patrols and the shared business inventory.
const policeRoutes=[[[6,-55],[6,4],[-11,4],[-11,-55]],[[11,11],[11,56],[-11,56],[-11,11]],[[-11,-90],[-105,-90],[-105,-160],[-11,-160]],[[11,-90],[105,-90],[105,-230],[11,-230]],[[-105,-300],[0,-300],[0,-435],[-105,-435]],[[105,-300],[270,-300],[270,-370],[105,-370]]];
policeRoutes.push(...EXTRA_PATROL_ROUTES);
const officers=policeRoutes.map((r,i)=>{let g=i?bobble(r[0][0],r[0][1],0x243d59,0xcfa984,0x354350):patrol;g.userData.cop=true;rounded(0,2.18,0,.79,.16,.68,0x233b56,g);rounded(0,2.12,.36,.6,.05,.29,0x192b40,g);let badge=rounded(.13,1.12,.19,.1,.13,.035,0xe1ba63,g);badge.material=badge.material.clone();g.userData.warningMaterials=[badge.material];return g;});
function ensurePolice(){s.police??={cooldown:0,search:null,report:null,arrests:0,officers:policeRoutes.map(r=>({x:r[0][0],z:r[0][1],angle:0,waypoint:1,mode:'patrol',suspicion:0,lost:0,target:null,lastX:r[0][0],lastZ:r[0][1]}))};return expandPoliceRoster(s.police,policeRoutes,{guest:net.role==='guest'});}
function copSight(a,b){return policeSight(a,b,blocked);}
function copTarget(role){return role==='guest'?(net.connected&&net.remote?net.remote:null):{x:player.x,z:player.z,vehicle:driving};}
function localPoliceRole(){return net.role==='guest'?'guest':'host';}
function currentPoliceFeedback(){return policeFeedback(ensurePolice(),localPoliceRole(),player,copSight,{connected:net.role!=='guest'||net.connected,stale:net.role==='guest'&&net.connected&&performance.now()-(net.workerSeenAt||0)>5000});}
const copPaths=new Map(),copGrid=new Map();let copPathBudget=1;
function copGridFree(x,z){let k=x+','+z;if(!copGrid.has(k))copGrid.set(k,!blocked(x*3,z*3));return copGrid.get(k);}
function copPath(a,b){const step=3,key=(x,z)=>x+','+z,sx=Math.round(a.x/step),sz=Math.round(a.z/step),gx=Math.round(b.x/step),gz=Math.round(b.z/step);let open=[{x:sx,z:sz,g:0,f:0}],seen=new Map(),closed=new Set();seen.set(key(sx,sz),open[0]);let end=null;
 for(let count=0;open.length&&count<500;count++){open.sort((a,b)=>b.f-a.f);let q=open.pop(),k=key(q.x,q.z);if(closed.has(k))continue;closed.add(k);if(Math.hypot(q.x-gx,q.z-gz)<1.5){end=q;break;}for(let [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){let x=q.x+dx,z=q.z+dz,k2=key(x,z),g=q.g+1;if(closed.has(k2)||!copGridFree(x,z)||!copSight({x:q.x*step,z:q.z*step},{x:x*step,z:z*step}))continue;let prev=seen.get(k2);if(prev&&prev.g<=g)continue;let v={x,z,g,f:g+Math.abs(x-gx)+Math.abs(z-gz),parent:q};seen.set(k2,v);open.push(v);}}
 let out=[];while(end?.parent){out.unshift({x:end.x*step,z:end.z*step});end=end.parent;}return out;
}
const COP_PERSONAL_SPACE=1.05;
function moveCop(c,i,target,speed,dt){let aim=target;if(!copSight(c,target)){let cache=copPaths.get(i);if(!cache||cache.age<=0||Math.hypot(cache.tx-target.x,cache.tz-target.z)>5){if(copPathBudget<=0)return;copPathBudget--;cache={path:copPath(c,target),age:4,tx:target.x,tz:target.z};copPaths.set(i,cache);}cache.age-=dt;while(cache.path.length&&Math.hypot(c.x-cache.path[0].x,c.z-cache.path[0].z)<.7)cache.path.shift();if(!cache.path.length)return;aim=cache.path[0];}
 let dx=aim.x-c.x,dz=aim.z-c.z,d=Math.hypot(dx,dz);if(d<.05)return;c.angle=Math.atan2(dx,dz);let amount=Math.min(speed*dt,d);
 // v143 playtest: an officer used to run straight through the camera (navy/yellow wall filling the screen). Hold at arm's length; grabs still trigger inside 2.6 m.
 {const px=player.x-c.x,pz=player.z-c.z,pd=Math.hypot(px,pz);if(active&&!driving&&(px*dx+pz*dz)>0&&Math.abs(px*dz-pz*dx)/d<.7)amount=Math.min(amount,Math.max(0,pd-COP_PERSONAL_SPACE));}
 let nx=c.x+dx/d*amount,nz=c.z+dz/d*amount;if(!blocked(nx,c.z))c.x=nx;if(!blocked(c.x,nz))c.z=nz;
}
function interruptPoliceWork(){if(stationTask)cancelStation();cancelPlacement();work=null;stationHeld=stationAssist=false;$('work').style.display='none';watering.visible=false;}
function beginPoliceSearch(role,fled=false){if(net.role==='guest'||!['host','guest'].includes(role))return;let p=ensurePolice();if(p.search||p.cooldown>0)return;p.search={role,remaining:4,fled};interruptPoliceWork();if(role===localPoliceRole()){close();keys={};locomotion.x=locomotion.z=0;driveSpeed=0;toast('Police body search — checking shared carried gummy stock.');}save();}
function finishPoliceSearch(){const p=ensurePolice(),q=p.search;if(net.role==='guest'||!q)return;const out=searchPenalty({day:s.day,cash:s.cash,raw:s.raw,gummies:s.gummies,packs:s.packs,spared:q.spared,fled:!!q.fled});const seized=out.seized,fine=Math.min(Math.max(0,s.cash),out.fine);s.raw=out.raw;s.gummies=out.gummies;s.packs=out.packs;s.cash-=fine;if(seized){for(let deal of s.deals){if(s.threads[deal.npc]&&(s.packs[deal.t]||0)<deal.qty){s.threads[deal.npc].status='cancelled';s.threads[deal.npc].messages.push({mine:false,text:'Your delivery was cancelled after the police seized the stock.'});}}s.deals=s.deals.filter(deal=>(s.packs[deal.t]||0)>=deal.qty);if(s.listing&&!(s.packs[s.listing.t]>0))s.listing=null;p.arrests++;}p.report={seized,fine,role:q.role,day:s.day,time:s.time,fled:!!q.fled,tier:out.tier};if(out.tier==='warning')p.warnedDay=s.day;p.search=null;p.cooldown=50;s.heat=seized?25:out.tier==='warning'?Math.min(s.heat,15):0;for(let c of p.officers){c.mode='patrol';c.target=null;c.suspicion=0;c.lost=0;c.squad='';c.grab=0;}if(p.chase)p.chase=freshChase();save();toast(penaltyMessage({tier:out.tier,seized,fine},cash));}
function tickPolice(dt){if(net.role==='guest')return;dt=Number.isFinite(dt)?Math.max(0,Math.min(.06,dt)):0;copPathBudget=1;let p=ensurePolice();p._squadStepped=false;p.cooldown=Math.max(0,p.cooldown-dt);if(p.search){p.search.remaining-=dt;if(p.search.remaining<=0)finishPoliceSearch();return;}if(!s.made&&!s.sold&&!curfewActive(s.time))return;
 const targets=[['host',copTarget('host')],['guest',copTarget('guest')]].filter(a=>a[1]);
 const shielded=firstSaleProtected(s);
 p.officers.forEach((c,i)=>{if(c.squad){stepSquadOfficer(c,i,dt,p);return;}if(c.mode==='patrol'){const route=policeRoutes[i],t={x:route[c.waypoint][0],z:route[c.waypoint][1]};moveCop(c,i,t,curfewActive(s.time)&&!shielded?3.3:2.2,dt);if(Math.hypot(c.x-t.x,c.z-t.z)<1)c.waypoint=(c.waypoint+1)%route.length;if(p.cooldown)return;let found=null;const notice=policeNotice(s.heat,curfewActive(s.time));for(let [role,t] of targets){let dx=t.x-c.x,dz=t.z-c.z,d=Math.hypot(dx,dz),cone=(Math.sin(c.angle)*dx+Math.cos(c.angle)*dz)/Math.max(.01,d);if(d<notice.range&&(cone>.15||d<4)&&copSight(c,t)){found=[role,t,d];break;}}if(found&&!shielded){c.suspicion=Math.min(100,c.suspicion+dt*notice.suspicion);c.target=found[0];if(c.suspicion>=100){c.mode='stop';c.lost=0;c.lastX=found[1].x;c.lastZ=found[1].z;}}else if(!shielded)c.suspicion=Math.max(0,c.suspicion-dt*15);
 }else{let t=copTarget(c.target);if(!t){c.mode='patrol';return;}let d=Math.hypot(c.x-t.x,c.z-t.z),visible=d<36&&copSight(c,t);if(visible){c.lastX=t.x;c.lastZ=t.z;if(c.mode==='pursuit')c.lost=0;}else if(c.mode==='pursuit')c.lost+=dt;
 if(c.mode==='stop'){c.lost+=dt;if(c.lost>4){c.mode='pursuit';c.lost=0;s.heat=Math.max(70,s.heat);for(let j=0;j<p.officers.length;j++){let backup=p.officers[j];if(j!==i&&Math.hypot(backup.x-c.x,backup.z-c.z)<85&&!backup.squad){backup.mode='pursuit';backup.target=c.target;backup.lastX=t.x;backup.lastZ=t.z;backup.lost=0;}}}}
 if(c.lost>18&&c.mode==='pursuit'){c.mode='patrol';c.suspicion=0;c.target=null;return;}moveCop(c,i,{x:c.lastX,z:c.lastZ},c.mode==='pursuit'?8.2:4.7,dt);if(d<1.8&&visible&&!t.vehicle&&!shielded)beginPoliceSearch(c.target,c.mode==='pursuit');}
 });
 if(!shielded)maybeEngageSquad(p);
}
const policeAction=doAction;doAction=function(k,a,b,c){let p=ensurePolice(),role=processingRemote?'guest':localPoliceRole();if(p.search)return;if(k==='complyPolice'){let cop=p.officers.find(o=>o.target===role&&o.mode!=='patrol'&&Math.hypot(o.x-player.x,o.z-player.z)<18&&copSight(o,player));if(cop)beginPoliceSearch(role,cop.mode==='pursuit');else if(!processingRemote)toast('Move within 18 m of a visible officer who is stopping you, then press H.');return;}let sold=s.sold;policeAction(k,a,b,c);if(k==='deliver'&&s.sold>sold)for(let officer of p.officers)if(Math.hypot(officer.x-player.x,officer.z-player.z)<26&&copSight(officer,player)){officer.mode='pursuit';officer.target=role;officer.lastX=player.x;officer.lastZ=player.z;officer.lost=0;s.heat=Math.max(85,s.heat);save();}};ACTION_NAMES.push('complyPolice');
function complyPolice(){if(!active)return;const feedback=currentPoliceFeedback();if(!feedback.canComply){toast(feedback.message||'No visible officer is stopping you within 18 m.');return;}interruptPoliceWork();close();action('complyPolice');}window.complyPolice=complyPolice;
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h'&&active&&!e.repeat&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))complyPolice();});
let policeStage='';
const policeUpdate=update;update=function(dt){let p=ensurePolice(),searching=p.search?.role===localPoliceRole();if(active&&p.search)interruptPoliceWork();if(searching){keys={};locomotion.x=locomotion.z=0;driveSpeed=0;if(panel)close();}policeUpdate(dt);if(active&&(!panel||p.search)&&net.role!=='guest')tickPolice(dt);
 p.officers.forEach((c,i)=>{let g=officers[i];g.position.set(c.x,terrainHeight(c.x,c.z),c.z);g.rotation.y=c.angle;g.userData.legs?.forEach((leg,j)=>leg.rotation.x=Math.sin(now*(c.mode==='pursuit'?13:7)+j*Math.PI)*.35);});
 syncSquadCast();
 const feedback=currentPoliceFeedback();
 $('policeHUD').hidden=!active||!feedback.message;$('policeStatus').textContent=feedback.message;$('policeComply').hidden=!['stop','pursuit'].includes(feedback.stage);$('policeComply').disabled=!feedback.canComply;
 if(feedback.stage==='pursuit'&&policeStage!=='pursuit'){playTone(430,.25,.035);toast('Police pursuit. Nearby patrols are responding.');}policeStage=feedback.stage;
};
const policeMenu=menu;menu=function(which,data){policeMenu(which,data);if(which==='journal')$('modal').innerHTML+='<h3>Gummy enforcement</h3><p>Police patrol every district. Nearby officers may stop you; witnessed deals trigger pursuit and backup. Press H to comply. Searches seize carried raw, loose and packaged gummies and cancel affected orders. Stockroom packs, equipment, seeds and bank funds stay safe. Fines use available cash only. Co-op shares inventory, so either player’s search affects the business. Daytime patrols begin after your first gummy is made. From 21:00 to 05:00 the curfew is in force: patrols are out, and officers notice you from farther away. Heat does not cool off during curfew.</p>';};window.menu=menu;

// V11 visual layer. Save data, world extents, collider arrays and gameplay are unchanged.
const visualActors=[];
// v126: the person kit draws shoes, uniforms and work clothes on the body itself. The older
// fixed-position outfit, accessory and foot overlays stay built (and tested) but out of the scene.
const retiredPeopleLayer=new THREE.Group();retiredPeopleLayer.name='Retired v125 people overlays';
residentFootSilhouettes=createResidentFootSilhouettes({THREE,scene:retiredPeopleLayer,actors:visualActors,quality,capacity:48});
chunkyCast=createChunkyCast({THREE,scene,actors:visualActors,points,quality,capacity:48});
streetCrowd=createStreetCrowd({THREE,scene,blocked,floorHeight,capacity:32,time:s.time});
function gummyCrowdPreview(mode='street'){
 load('story',1,true);
 const overlay=document.getElementById('overlay');if(overlay)overlay.hidden=true;
 if(document.body?.dataset)document.body.dataset.panel='';panel='';
 streetCrowd.sync(s.time);streetCrowd.update({dt:0,now,time:s.time,camera,active:true,floorHeight,blocked});
 const focus=streetCrowd.focus(mode==='sit'?'sit':'close');
 const ahead={x:Math.sin(focus.yaw),z:Math.cos(focus.yaw)};
 if(mode==='street'){player.set(-24,1.62,16);pitch=.22;yaw=Math.atan2(-24-player.x,4-player.z);}
 else{player.set(focus.x+ahead.x*1.45,1.58,focus.z+ahead.z*1.45);pitch=mode==='close'?0.04:0.12;yaw=Math.atan2(-(focus.x-player.x),-(focus.z-player.z));}
 syncPlayerView();camera.lookAt(mode==='street'?0:focus.x,mode==='close'?1.55:1.15,mode==='street'?4:focus.z);
 renderFrame();camera.lookAt(mode==='street'?0:focus.x,mode==='close'?1.55:1.15,mode==='street'?4:focus.z);
 const visible=streetCrowd.people.filter(person=>Math.hypot(person.x-player.x,person.z-player.z)<STREET_CROWD_FAR).length;
 return {count:streetCrowd.count,near:visible,far:STREET_CROWD_FAR,colliders:STREET_CROWD_COLLIDERS.length,activity:focus.activity,x:+focus.x.toFixed(2),z:+focus.z.toFixed(2)};
}
window.gummyCrowdPreview=gummyCrowdPreview;
// Screenshot hook: stand 1.6 m in front of the nth animated resident (optionally a role) and face them.
function gummyCastPreview(index=0,role='',dist=1.7){
 if(!active)load('story',1,true);
 const overlay=document.getElementById('overlay');if(overlay)overlay.hidden=true;
 if(document.body?.dataset)document.body.dataset.panel='';panel='';
 const pool=visualActors.filter(a=>!role||(role==='police'?!!a.g.userData.cop:!a.g.userData.cop));
 const a=pool[Math.max(0,Math.min(pool.length-1,index|0))];if(!a)return {count:0};
 const p=a.g.position,face=a.g.rotation.y;
 player.set(p.x+Math.sin(face)*dist,1.62,p.z+Math.cos(face)*dist);pitch=-.05;yaw=Math.atan2(player.x-p.x,player.z-p.z);
 syncPlayerView();renderFrame();
 return {count:pool.length,x:+p.x.toFixed(2),z:+p.z.toFixed(2),cop:!!a.g.userData.cop};
}
window.gummyCastPreview=gummyCastPreview;
let citizenAssetStatus='loading';
function cloneRig(source){
 const copy=source.clone(true),map=new Map();
 function pair(a,b){map.set(a,b);for(let i=0;i<a.children.length;i++)pair(a.children[i],b.children[i]);}
 pair(source,copy);
 source.traverse(original=>{if(!original.isSkinnedMesh)return;const mesh=map.get(original);mesh.skeleton=original.skeleton.clone();mesh.skeleton.bones=original.skeleton.bones.map(b=>map.get(b));mesh.bind(mesh.skeleton,original.bindMatrix.clone());});
 return copy;
}
function installCitizen(gltf,variant=0){
 for(const g of avatars){
  if(g.userData.id%3!==variant||visualActors.some(a=>a.g===g))continue;
  const body=cloneRig(gltf.scene),palette=g.userData.palette||{};body.scale.set(.86*(.94+(g.userData.id%5)*.025),.86,.86);
  const isCop=!!g.userData.cop,originalChildren=g.children.filter(o=>!o.userData.gameplayAttachment);
  const variants=new Map();
  body.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;
   const tint=m=>{if(variants.has(m))return variants.get(m);const v=m.clone();
    if(v.name==='Skin')v.color.set(palette.skin||0xc58f6c);
    if(v.name==='Shirt')v.color.set(isCop?0x243c58:palette.color||0x497d89);
    if(v.name==='Hair')v.color.set(palette.hair||0x46312d);
    v.roughness=Math.max(v.roughness,.65);variants.set(m,v);return v;};
   o.material=Array.isArray(o.material)?o.material.map(tint):tint(o.material);
  });
  concealSculptedResident(body);
  const clothing=createResidentClothing({body,id:g.userData.id,baseColor:palette.color,isCop});
  // Hide fallback only after a complete, valid asset is ready.
  originalChildren.forEach(o=>o.visible=false);g.add(body);
  const mixer=new THREE.AnimationMixer(body),actions={};
  for(const clip of gltf.animations)actions[clip.name]=mixer.clipAction(clip);
  const proportions=createResidentProportionRig({body,id:g.userData.id});applyResidentProportionRig(proportions);
  const head=body.getObjectByName('Head');
  let expression=null,hairstyle=null;
  if(head){expression=createResidentExpressionRig({head,hairColor:palette.hair,skinColor:palette.skin});hairstyle=createResidentHairstyleRig({head,id:g.userData.id,hairColor:palette.hair});
   const streetHat=addStreetHat(head,g.userData.id,isCop||points.some(p=>p.actor===g&&p.type!=='customer'));if(streetHat&&hairstyle)hairstyle.mesh.visible=false;
   // Accessories attach to the actual animated head bone; local Y follows the bone.
   if(isCop){let cap=new THREE.Mesh(new THREE.CylinderGeometry(.35,.38,.11,12),mat(0x233b56));cap.position.set(0,.72,-.02);head.add(cap);let brim=new THREE.Mesh(new THREE.BoxGeometry(.48,.22,.04),mat(0x192b40));brim.material=brim.material.clone();g.userData.warningMaterials.push(brim.material);brim.position.set(0,.66,.33);head.add(brim);}
  }
  actions.Idle?.play();visualActors.push({g,body,mixer,actions,current:'Idle',previous:g.position.clone(),speed:0,expression,hairstyle,expressionHair:palette.hair,expressionSkin:palette.skin,proportions,clothing,clothingBase:palette.color,isCop});
 }
 citizenAssetStatus='ready';
}
const citizenLoads=[false,false,false],citizenTemplates=[];
if(typeof GLTFLoader!=='undefined')for(let variant=0;variant<3;variant++)new GLTFLoader().load('./assets/citizen-v11'+(variant?'-'+variant:'')+'.glb',gltf=>{
 if(!gltf.animations.some(a=>a.name==='Walk')||!gltf.scene.getObjectByProperty('isSkinnedMesh',true)){citizenAssetStatus='partial';return;}
 roundResidentAsset(gltf);citizenTemplates[variant]=gltf;installCitizen(gltf,variant);citizenLoads[variant]=true;citizenAssetStatus=citizenLoads.every(Boolean)?'ready':'partial';
},undefined,e=>{citizenAssetStatus='partial';console.warn('Citizen asset unavailable; retaining previous characters.',e);});
// Presentation-only association: never infer the addressee from nearby bodies.
// Counter points, rather than the body behind them, retain the existing action reach.
function conversationPointFor(which,data){
 if(!active||driving||net.role==='guest'&&!net.connected)return null;
 if(which==='customer'){
  const i=Number.isInteger(data)?data:selected;
  return customerExchangeStatus(i).ok?points.find(p=>p.type==='customer'&&p.i===i&&p.actor===people[i])||null:null;
 }
 if(!['dealer','hardware','store','helpers','property','reception','laundry','servo'].includes(which))return null;
 const usable=p=>p?.type===which&&p.actor&&pointVisible(p)&&pointApproach(player,p,blocked,floorHeight,5);
 if(usable(near))return near;
 if(usable(conversationPoint))return conversationPoint;
 let target=null,distance=Infinity;
 for(const p of points)if(usable(p)){const d=Math.hypot(player.x-p.x,player.z-p.z);if(d<distance){distance=d;target=p;}}
 return target;
}
function addressedActor(g){
 const p=conversationPoint;
 if(!active||driving||net.role==='guest'&&!net.connected||!p||p.actor!==g||p.type!==panel)return false;
 return p.type==='customer'?p.i===selected&&customerExchangeStatus(p.i).ok:pointApproach(player,p,blocked,floorHeight,5);
}
function actorAnimation(a,dt,distance=0){
 const moved=Math.hypot(a.g.position.x-a.previous.x,a.g.position.z-a.previous.z);a.previous.copy(a.g.position);
 const speed=dt>0&&moved<3?moved/dt:0;if(moved>=3)a.speed=0;else a.speed+=(speed-a.speed)*(1-Math.exp(-Math.max(0,dt)*14));
 const addressed=addressedActor(a.g)||exchangeGestureTargets(a.g);
 if(addressed&&a.speed<.08)a.g.rotation.y=turnTowards(a.g.rotation.y,Math.atan2(player.x-a.g.position.x,player.z-a.g.position.z),dt,5);
 let desired=residentLocomotionClip(a.speed,a.current);
 const index=officers.indexOf(a.g),police=s.police;
 if(index>=0&&police?.search&&police.officers[index]?.target===police.search.role&&(police.search.role===localPoliceRole()||other?.position)&&a.g.position.distanceTo(police.search.role===localPoliceRole()?player:other.position)<4)desired='Search';
 else if(index>=0&&police?.officers[index]?.mode==='stop')desired='Talk';
 else if(a.g===other&&police?.search&&police.search.role!==localPoliceRole())desired='Surrender';
 else if(a.speed<.08&&addressed)desired='Talk';
 else if(a.speed<.08&&!isNaN(a.g.userData.id)&&!people.includes(a.g)&&index<0&&a.g!==other&&a.g.position.distanceTo(player)<20&&Math.floor(now/9+a.g.userData.id)%4===0)desired='Work';
 if(desired!==a.current&&a.actions[desired]){applyResidentTransition(a.actions,a.current,desired);a.current=desired;}
 const action=a.actions[a.current];if(action)action.timeScale=residentActionRate(desired,a.speed,a.body.scale.y);
 a.mixer.update(dt);applyResidentProportionRig(a.proportions);if(a.g.userData.carrying){for(const side of [-1,1]){const upper=a.body.getObjectByName('UpperArm'+side),fore=a.body.getObjectByName('Forearm'+side);if(upper)upper.rotation.x=-.45;if(fore)fore.rotation.x=-1.05;}}const expression=residentExpressionState({now,id:a.g.userData.id,talking:desired==='Talk',working:desired==='Work',moving:a.speed>.08,active,distance});applyResidentBlinkMorph(a.body,expression);if(a.expression)updateResidentExpressionRig(a.expression,expression);
}
let visualPrevious=performance.now();
const visualRender=renderFrame;
renderFrame=function(){
 const t=performance.now(),dt=Math.max(0,Math.min(.08,(t-visualPrevious)/1000));visualPrevious=t;
 for(const a of visualActors){const distance=a.g.position.distanceTo(camera.position);const nearRig=distance<(quality==='performance'?75:125);a.body.visible=nearRig&&!a.isCop;if(nearRig)actorAnimation(a,dt,distance);else a.previous.copy(a.g.position);}
 residentFootSilhouettes.update({active});
 chunkyCast?.update({now,camera});
 streetCrowd?.update({dt,now,time:s.time,camera,active,floorHeight,blocked,namedVisible:storyCastVisible,rain:active?rainAt(s.day,s.time):0});
 if(visualTown)for(const chunk of visualTown.children){const c=chunk.userData.center;if(c)chunk.visible=camera.position.distanceTo(c)<lookPreset(quality).townDistance+chunk.userData.radius;}
 visualRender();
};
// Environmental palette is synchronized by refreshWorldLighting before every draw.

let equipmentAssetStatus='loading';
if(typeof GLTFLoader!=='undefined')new GLTFLoader().load('./assets/equipment-v11.glb',gltf=>{
 const tent=gltf.scene.getObjectByName('Tent'),mixer=gltf.scene.getObjectByName('Mixer'),phone=gltf.scene.getObjectByName('Payphone');
 if(!tent||!mixer||!phone){equipmentAssetStatus='failed';return;}
 gltf.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 tents.forEach((g,i)=>{for(const child of [...g.children])if(child!==plantVisuals[i])g.remove(child);g.add(tent.clone(true));});
 mixers.forEach(g=>{g.clear();g.add(mixer.clone(true));attachObjectSilhouette(g,'station',{quality});});
 for(const o of [...scene.children])if(o.isMesh&&Math.abs(o.position.x+47)<.7&&Math.abs(o.position.z-29)<.65&&o.position.y>0&&o.position.y<3.1)scene.remove(o);
 const model=phone.clone(true);dressPayphone(model);model.position.set(-47,0,29);model.userData.batchStatic=true;model.traverse(o=>{if(o.isMesh&&o.userData)delete o.userData.name;});scene.add(model);equipmentAssetStatus='ready';
},undefined,e=>{equipmentAssetStatus='failed';console.warn('Equipment retains previous artwork',e);});


// V12: progression, explicit worker assignments and transactional batches.
const normalize11=normalize;
normalize=function(v){normalize11(v);v.tutorialHidden??=false;v.staffConfig??={};for(const role of ['gardener','crafter','seller'])v.staffConfig[role]=normalizeStaffRole(role,v.staffConfig[role],BASE_COUNT);v.cravings=normalizeCravings(v.cravings,CONTACTS.length,STRAINS.length);grantStarter(v);normalizeSquadSave(v);v.knownRecipes=v.knownRecipes&&typeof v.knownRecipes==='object'&&!Array.isArray(v.knownRecipes)?v.knownRecipes:{};for(let i=BASE_COUNT;i<STRAINS.length;i++)if(((v.gummies?.[i]||0)+(v.packs?.[i]||0)+(v.storedPacks?.[i]||0))>0&&STRAINS[i].recipeKey)v.knownRecipes[STRAINS[i].recipeKey]=true;return v;};normalize(s);
STORY[3].text='At Hank’s buy one tent ($100), a watering can ($15), trimmers ($10) and a packaging station ($100). These are reusable.';
STORY[3].done=()=>s.tents>0&&s.can&&s.trimmers&&s.packStation;
STORY[4].done=()=>s.planted>0||(s.seeds.some(n=>n>0)&&s.soil>0);
STORY[7].text='Harvest the mature plant using your trimmers. One crop gives four units.';
STORY[8].text='Buy 10 wrappers ($10) at the corner store. At your worktable, make one gummy, then wrap it. The opening shop run is $350, leaving $50.';
STORY[8].done=()=>s.made>0;
const stockUsed=()=>['raw','gummies','packs','storedPacks'].reduce((sum,key)=>sum+s[key].reduce((a,b)=>a+b,0),s.crafterCargo?1:0);
const stockCapacity=()=>[64,256,640][s.house];
const storageCapacity=()=>[40,160,400][s.house];
const storedUsed=()=>s.storedPacks.reduce((a,b)=>a+b,0);
function taskReason(k,a,b){if(!s.room)return 'Rent Room 04 at Palm Court first.';if(k==='prepare'&&!s.soil)return 'You need one bag of soil from Milo.';if(k==='plant'&&!s.seeds[b])return 'Buy that seed from Milo first.';if(k==='water'&&!s.can)return 'Buy a watering can at Hank’s.';if(k==='water'&&!s.water)return 'Your can is empty. Refill it at the sink for free.';if(k==='harvest'&&!s.trimmers)return 'Buy the $10 trimmers at Hank’s.';if(k==='harvest'&&stockUsed()+4>stockCapacity())return 'Property stock capacity reached. Sell some stock before harvesting.';if(k==='make'&&!s.raw[a])return 'Harvest a mature plant first.';if(k==='pack'&&!s.packStation)return 'Buy the $100 packaging station at Hank’s.';if(k==='pack'&&!s.wrappers)return 'Buy wrappers at the corner store.';if(k==='mix'&&!s.ingredients[b])return 'Buy that ingredient at the servo.';return 'That task is not ready yet. Check the workstation supplies.';}
const ready11=manualReady;manualReady=function(k,a,b){return ready11(k,a,b)&&(k!=='harvest'||stockUsed()+4<=stockCapacity());};
const action11=action;action=function(k,a,b,c){if(net.role==='guest'&&!net.connected){toast('The host is disconnected. Rejoin before changing the shared business.');return;}if(MANUAL[k]&&!manualReady(k,a,b)){toast(taskReason(k,a,b));return;}action11(k,a,b,c);};window.action=action;
function batchReady(q){return q&&['make','pack','mix'].includes(q.kind)&&Number.isInteger(q.index)&&q.index>=0&&q.index<STRAINS.length&&Number.isInteger(q.count)&&q.count>=1&&q.count<=4&&s.room&&(q.count===1||s.bench>0)&&!ensurePolice().search&&(q.kind==='make'?s.raw[q.index]>=q.count:q.kind==='pack'?s.packStation&&s.gummies[q.index]>=q.count&&s.wrappers>=q.count:s.mixer&&q.index<BASE_COUNT&&Number.isInteger(q.ingredient)&&q.ingredient>=0&&q.ingredient<INGREDIENTS.length&&s.ingredients[q.ingredient]>=q.count&&s.gummies[q.index]+Math.max(0,s.packs[q.index]-reservedQty(q.index))>=q.count);}
function startBatch(kind,index,count,ingredient=0){const q={kind,index,count,ingredient};if(!batchReady(q)){toast('This batch needs enough stock and wrappers/ingredients. A press upgrade unlocks batches of four.');return;}action(kind,index,kind==='mix'?ingredient:undefined);if(stationTask){stationTask.batch=q;paintStation();}}
window.startBatch=startBatch;
const paint11=paintStation;paintStation=function(){paint11();if(stationTask?.batch)$('stationHUD').innerHTML+='<p>Batch of '+stationTask.batch.count+' · stock is checked again on completion. Cancel keeps everything.</p>';};
advanceStation=function(amount){if(!stationTask)return;const t=stationTask,step=MANUAL[t.k][t.step];t.progress+=amount/Math.sqrt(t.batch?.count||1);if(t.progress>=step[2]){t.step++;t.progress=0;t.elapsed=0;t.gesture={};stationHeld=false;stationAssist=false;if(t.step>=MANUAL[t.k].length){const args=t.batch?['batch',t.batch]:[t.k,t.a,t.b,t.c];cancelStation();if(ensurePolice().search){toast('Police search interrupted the task. Nothing was consumed.');return;}const access=physicalActionAccess(args[0],args[1]);if(access&&!access.ok){toast(access.reason);return;}commitAction(...args);if(net.role!=='guest'){work=null;$('work').style.display='none';watering.visible=false;save();}playTone(620,.08,.025);return;}}paintStation();};
const do11=doAction;doAction=function(k,a,b,c){
 if(ensurePolice().search)return;
 if(k==='staffAssign'){if(!s.helpers[a]||!s.staffConfig[a])return;const cfg=s.staffConfig[a];if(b==='strain'&&Number.isInteger(c)&&c>=-1&&c<BASE_COUNT)cfg.strain=c;else if(b==='tent'&&a==='gardener'&&Number.isInteger(c)&&c>=-1&&c<maxTents())cfg.tent=c;else if(b==='stock'&&['crafter','seller'].includes(a)&&['carried','stored'].includes(c))cfg.stock=c;else if(b==='route'&&['gardener','seller'].includes(a)&&['walk','timer'].includes(c))cfg.route=c;else return;save();if(!processingRemote)menu(panel==='staffboard'?'staffboard':'helpers');return;}
 if(k==='batch'){if(!batchReady(a)){toast('Supplies changed while you worked. Nothing was consumed; check the batch again.');return;}for(let i=0;i<a.count;i++)do11(a.kind,a.index,a.ingredient);save();return;}
 if(k==='harvest'&&stockUsed()+4>stockCapacity()){toast(taskReason(k,a,b));return;}
 if(k==='stash'&&Number.isInteger(b)&&storedUsed()+b>storageCapacity()){toast('Stockroom full. Collect or sell packs, or buy a bigger property.');return;}
 if(k==='cancelDeal'){const deal=s.deals.find(d=>d.npc===a);if(!deal)return;s.deals=s.deals.filter(d=>d!==deal);if(s.threads[a]){s.threads[a].status='closed';s.threads[a].messages.push({mine:true,text:'Sorry, I need to cancel this delivery. My stock is available again.'});}save();if(!processingRemote)menu('deals');return;}
 const before=s.sold;do11(k,a,b,c);if(k==='deliver'&&before===0&&s.sold>0){toast('FIRST SALE! You earned '+cash(s.earned)+'. Call Gramps, then reinvest in your next crop.');playTone(780,.22,.05);}if(k==='house')refreshBase();
};ACTION_NAMES.push('staffAssign','batch','cancelDeal');
function crewStatusHTML(role){
 const status=workerStatus(role),advice=workerAdvice(status),cargo=role==='crafter'&&s.crafterCargo;
 return '<strong>'+esc(status)+'</strong><p>'+esc(advice.text)+'</p>'+(cargo?'<p class="crew-cargo">In transit: '+esc(STRAINS[cargo.index]?.name||'batch')+' · '+(cargo.phase==='input'?'one input and one reserved wrapper':'one finished pack')+'</p>':'')+(advice.target?'<button class="ghost" onclick="trackPlace(\''+advice.target+'\')">Find '+esc(advice.target)+'</button>':advice.screen?'<button class="ghost" onclick="menu(\''+advice.screen+'\')">Connection options</button>':'');
}
function crewSectionHTML(role){
 const title={gardener:'Gardener',crafter:'Gummy maker',seller:'Sales assistant'}[role],c=s.staffConfig[role],hired=s.helpers[role],disabled=(net.role==='guest'&&!net.connected||!physicalActionAccess('worker',role).ok)?' disabled':'';
 let html='<section class="staffcard"><h3>'+title+'</h3><div id="crewStatus_'+role+'" class="crew-status">'+crewStatusHTML(role)+'</div>';
 if(hired)html+='<p id="crewAssignment_'+role+'" class="crew-assignment">'+esc(staffAssignment(role,c,STRAINS))+'</p><button id="crewToggle_'+role+'" class="ghost"'+disabled+' onclick="action(\'worker\',\''+role+'\')">'+(s.workerEnabled[role]?'Pause':'Resume')+' assignment</button><label>Product <select id="crewProduct_'+role+'"'+disabled+' onchange="action(\'staffAssign\',\''+role+'\',\'strain\',Number(this.value))"><option value="-1">Any product</option>'+STRAINS.slice(0,BASE_COUNT).map((p,i)=>'<option value="'+i+'" '+(c.strain===i?'selected':'')+'>'+esc(p.name)+'</option>').join('')+'</select></label>'+(role==='gardener'?'<label>Tent <select id="crewTent_'+role+'"'+disabled+' onchange="action(\'staffAssign\',\'gardener\',\'tent\',Number(this.value))"><option value="-1">All installed tents</option>'+Array.from({length:maxTents()},(_,i)=>'<option value="'+i+'" '+(c.tent===i?'selected':'')+'>Tent '+(i+1)+'</option>').join('')+'</select></label>':'<label>Stock <select id="crewStock_'+role+'"'+disabled+' onchange="action(\'staffAssign\',\''+role+'\',\'stock\',this.value)"><option value="stored" '+(c.stock==='stored'?'selected':'')+'>'+(role==='seller'?'Stockroom packs':'Walks the workshop')+'</option><option value="carried" '+(c.stock==='carried'?'selected':'')+'>'+(role==='seller'?'Carried packs':'Background timer')+'</option></select></label>');
 if(hired&&(role==='gardener'||role==='seller'))html+='<label>Route <select id="crewRoute_'+role+'"'+disabled+' onchange="action(\'staffAssign\',\''+role+'\',\'route\',this.value)"><option value="walk" '+(c.route==='walk'?'selected':'')+'>Walks the route</option><option value="timer" '+(c.route!=='walk'?'selected':'')+'>Background timer</option></select></label>';
 return html+'</section>';
}
function refreshCrewPanel(){
 if(!['helpers','staffboard'].includes(panel))return;
 for(const role of ['gardener','crafter','seller']){
  const e=document.getElementById('crewStatus_'+role),html=crewStatusHTML(role),cfg=s.staffConfig[role],disabled=net.role==='guest'&&!net.connected;
  if(e&&e.innerHTML!==html)e.innerHTML=html;
  const assignment=document.getElementById('crewAssignment_'+role);if(assignment)assignment.textContent=staffAssignment(role,cfg,STRAINS);
  const toggle=document.getElementById('crewToggle_'+role);if(toggle){toggle.textContent=(s.workerEnabled[role]?'Pause':'Resume')+' assignment';toggle.disabled=disabled||!physicalActionAccess('worker',role).ok;}
  for(const [id,value] of [['Product',cfg.strain],['Stock',cfg.stock],['Tent',cfg.tent],['Route',cfg.route]]){const select=document.getElementById('crew'+id+'_'+role);if(select){select.disabled=disabled||!physicalActionAccess('staffAssign',role).ok;if(select!==document.activeElement)select.value=String(value);}}
 }
}
function workerStatus(role){if(!s.helpers[role])return 'Not hired';if(!s.workerEnabled[role])return 'Paused';const cfg=s.staffConfig[role];if(role==='gardener'&&cfg.route==='walk'&&physicalGardener.home===s.house&&!['Not hired','Background timer'].includes(physicalGardener.status))return physicalGardener.status;if(role==='gardener'){if(!s.installed?.some(i=>i<maxTents()&&(cfg.tent<0||cfg.tent===i)))return 'Waiting: install an assigned tent';if(!s.can&&!s.irrigation)return 'Waiting: watering can';if(!s.trimmers)return 'Waiting: trimmers';if(stockUsed()+4>stockCapacity())return 'Waiting: property stock full';if(s.plants.some((p,i)=>p&&(cfg.tent<0||cfg.tent===i)))return 'Tending assigned plants';if(!s.soil)return 'Waiting: soil';if(!s.seeds.some((n,i)=>n&&i<BASE_COUNT&&unlocked(i)&&(cfg.strain<0||cfg.strain===i)))return 'Waiting: assigned seeds';return 'Ready to plant';}if(role==='crafter'){if(cfg.stock==='stored'){if(net.role==='guest')return remoteWorkerStatus(net.remote?.worker,net.connected&&workerPoseValid(net.remote?.worker,WORLD),performance.now()-(net.workerSeenAt||0));return physicalCrafter.home===s.house?physicalCrafter.status:'Starting assignment';}if(!s.packStation)return 'Waiting: packaging station';if(!s.wrappers)return 'Waiting: wrappers';if(!s.raw.some((n,i)=>n&&(cfg.strain<0||i===cfg.strain))&&!s.gummies.some((n,i)=>n&&(cfg.strain<0||i===cfg.strain)))return 'Waiting: harvested or loose gummies';return 'Making and packing → '+cfg.stock;}if(cfg.route==='walk'&&physicalSeller.home===s.house&&!['Not hired','Background timer'].includes(physicalSeller.status))return physicalSeller.status;if(cfg.route==='walk')return 'Waiting for an agreed deal';let stock=cfg.stock==='stored'?s.storedPacks:s.packs;if(!stock.some((n,i)=>n>(cfg.stock==='carried'?reservedQty(i):0)&&(cfg.strain<0||i===cfg.strain)))return 'Waiting: unreserved '+cfg.stock+' packs';return 'Delivering '+cfg.stock+' packs · 90% base value';}
production=function(dt){
 for(const [i,p] of s.plants.entries()){if(p?.phase==='growing'&&Date.now()>=p.end)p.phase=p.waterings>=2?'mature':'thirsty';const cfg=s.staffConfig.gardener,assigned=(cfg.tent<0||cfg.tent===i)&&i<maxTents()&&s.installed?.includes(i);if(p&&['dry','thirsty'].includes(p.phase)&&(s.irrigation||(assigned&&s.staffConfig.gardener.route!=='walk'&&s.helpers.gardener&&s.workerEnabled.gardener&&s.can))){if(!s.irrigation){if(s.water===0)s.water=6;s.water--;}p.waterings++;p.phase='growing';p.start=Date.now();p.end=Date.now()+STRAINS[p.t].time*(1-s.lights*.15)*500;s.watered++;}}
 helperTimer+=dt;sellerTimer+=dt;
 if(helperTimer>4){helperTimer=0;const cfg=s.staffConfig.gardener;if(cfg.route!=='walk'&&s.helpers.gardener&&s.workerEnabled.gardener)for(const i of s.installed||[]){if(i>=maxTents()||(cfg.tent>=0&&cfg.tent!==i))continue;let p=s.plants[i];if(p?.phase==='mature'&&s.trimmers&&stockUsed()+4<=stockCapacity()){s.raw[p.t]+=4;s.harvested++;s.plants[i]=null;}if(!s.plants[i]&&s.soil>0){let t=s.seeds.findIndex((n,j)=>n>0&&j<BASE_COUNT&&unlocked(j)&&(cfg.strain<0||cfg.strain===j));if(t>=0){s.soil--;s.seeds[t]--;s.plants[i]={phase:'dry',t,waterings:0};s.planted++;}}}
 const c=s.staffConfig.crafter;if(c.stock==='carried'&&s.helpers.crafter&&s.workerEnabled.crafter&&s.packStation&&s.wrappers>0){let t=s.gummies.findIndex((n,j)=>n>0&&(c.strain<0||c.strain===j));if(t<0){t=s.raw.findIndex((n,j)=>n>0&&(c.strain<0||c.strain===j));if(t>=0){s.raw[t]--;s.gummies[t]++;s.made++;}}if(t>=0&&s.gummies[t]>0&&s.wrappers>0){s.gummies[t]--;s.wrappers--;s[c.stock==='stored'?'storedPacks':'packs'][t]++;}}
 }
 if(sellerTimer>22){sellerTimer=0;let c=s.staffConfig.seller,stock=c.stock==='stored'?s.storedPacks:s.packs;if(c.route!=='walk'&&s.helpers.seller&&s.workerEnabled.seller){let t=stock.findIndex((n,j)=>n>(c.stock==='carried'?reservedQty(j):0)&&(c.strain<0||c.strain===j));if(t>=0){stock[t]--;let pay=Math.round(value(t)*.9);s.cash+=pay;s.earned+=pay;s.sold++;s.xp+=5;toast('Sales assistant · '+cash(pay)+' · '+STRAINS[t].name);}}}
 const clock=(s.day-1)*1440+s.time;for(const d of [...s.deals])if(d.due&&clock>d.due){s.deals=s.deals.filter(x=>x!==d);s.relations[d.npc]=Math.max(0,relationship(d.npc)-5);if(s.threads[d.npc]){s.threads[d.npc].status='closed';s.threads[d.npc].messages.push({mine:false,text:'I had to leave. Text me again when you are ready.'});}toast(CONTACTS[d.npc].name+' left. Your stock is available again.');}
};
function toggleTutorial(){s.tutorialHidden=!s.tutorialHidden;save();menu('journal');}window.toggleTutorial=toggleTutorial;
const objective11=trackObjective;trackObjective=function(){if(s.chapter===7&&!s.wrappers&&!s.packs.some(n=>n)){trackPlace('store');return;}if(s.chapter===6&&!s.trimmers){trackPlace('hardware');return;}objective11();};window.trackObjective=trackObjective;
const menu11=menu;menu=function(which,data){menu11(which,data);
 if(which==='journal'||which==='pause')$('modal').innerHTML+=row('Optional tutorial',s.tutorialHidden?'Notebook reminders hidden. Progress is retained.':'Gramps’s next step appears on your HUD.',s.tutorialHidden?'Resume guide':'Hide guide','toggleTutorial()')+row('Short on funds?','The motel offers repeatable shifts paying $35 to your card. Withdraw at an ATM; water is free.','Find paid shift',"trackPlace('reception')");
 if(which==='staffboard')$('modal').innerHTML+='<div class="overline">WORKSHOP / SUPPLY TROLLEY ROSTER</div><h2>Your crew, right here.</h2><p>Check assignments and stopping reasons beside the work. Hiring remains at the Helping Hand.</p>';
 if(['helpers','staffboard'].includes(which))for(const role of ['gardener','crafter','seller'])$('modal').innerHTML+=crewSectionHTML(role);
 if(['bag','stockroom','helpers','staffboard','property'].includes(which))$('modal').innerHTML+='<p class="note">Property goods: '+stockUsed()+' / '+stockCapacity()+' · stockroom packs: '+storedUsed()+' / '+storageCapacity()+'. Existing excess stock is kept; new harvests wait for space.</p>';
 if(which==='craft'&&s.bench>0)for(let i=0;i<STRAINS.length;i++){if(s.raw[i]>=4)$('modal').innerHTML+=row('Batch: '+STRAINS[i].name,'Shape four with one longer hands-on operation.','Make 4',`startBatch('make',${i},4)`);if(s.gummies[i]>=4&&s.wrappers>=4)$('modal').innerHTML+=row('Batch: '+STRAINS[i].name,'Use four wrappers; commit together.','Wrap 4',`startBatch('pack',${i},4)`);}
 if(which==='mix'&&s.bench>0)$('modal').innerHTML+='<button class="primary" onclick="startBatch(\'mix\',Number(document.getElementById(\'mixBase\').value),4,Number(document.getElementById(\'mixIngredient\').value))">Mix batch of 4</button>';
 if(which==='deals'||which==='thread')for(const d of s.deals)if(which==='deals'||d.npc===(data??selected))$('modal').innerHTML+=row(CONTACTS[d.npc].name+' · '+cash(d.price*d.qty),'Deadline in '+Math.max(0,Math.ceil(d.due-((s.day-1)*1440+s.time)))+' game minutes. Cancelling releases reserved stock.','Cancel deal',`action('cancelDeal',${d.npc})`);
 if(which==='tent'&&s.plants[selected]?.phase==='mature'&&stockUsed()+4>stockCapacity())$('modal').innerHTML+='<p class="note">No room for this harvest. Sell stock or expand your property.</p>';
};window.menu=menu;
const ui11=updateUI;updateUI=function(){ui11();if(s.tutorialHidden)$('objective').innerHTML='<div class="overline">GUMMY BAY / YOUR OWN PACE</div><p>'+s.sold+' sold · '+cash(s.earned)+' earned</p><button class="trackbtn" onclick="menu(\'journal\')">Notebook / resume guide</button>';if(s.cash+s.bank<40&&!s.raw.some(n=>n)&&!s.gummies.some(n=>n)&&!s.packs.some(n=>n))$('objective').innerHTML+='<button class="trackbtn" onclick="trackPlace(\'reception\')">Need funds? Find a $35 shift →</button>';};

// Routed customers, safe vehicle sweeps, recovery and co-op command receipts.
const customerPaths=new Map();let customerPathBudget=1;
const customers11=updateCustomers;updateCustomers=function(dt){customerPathBudget=1;customers11(dt);};
function moveCustomerTo(c,i,target,dt){
 if(Math.hypot(player.x-c.x,player.z-c.z)<=2.5||(net.connected&&net.remote&&Math.hypot(net.remote.x-c.x,net.remote.z-c.z)<=2.5))return 'greeting';
 if(Math.hypot(c.x-target.x,c.z-target.z)<.12)return 'arrived';
 let route=customerPaths.get(i);
 if(!route||route.tx!==target.x||route.tz!==target.z||(!route.path&&!route.planner&&route.retry<=now)){
  route={tx:target.x,tz:target.z,path:null,planner:citizenRouteSteps(c,target,blocked),retry:now+3};customerPaths.set(i,route);
 }
 if(route.planner){
  if(customerPathBudget<=0)return 'planning';customerPathBudget--;
  const step=route.planner.next();if(!step.done)return 'planning';
  route.path=step.value;route.planner=null;route.retry=now+3;
 }
 if(!route.path)return 'blocked';
 let remaining=Math.max(0,Math.min(.06,dt))*1.05;
 while(route.path.length&&remaining>0){
  const aim=route.path[0],dx=aim.x-c.x,dz=aim.z-c.z,d=Math.hypot(dx,dz);
  if(d<.02){route.path.shift();continue;}
  const amount=Math.min(d,remaining),next={x:c.x+dx/d*amount,z:c.z+dz/d*amount};
  if(!segmentClear(c,next,blocked)){route.path=null;route.retry=now+1;return 'blocked';}
  c.x=next.x;c.z=next.z;remaining-=amount;if(d<=amount+.001)route.path.shift();
 }
 if(!route.path.length)customerPaths.delete(i);
 return 'walking';
}
function vehicleSweep(x,z,angle){const distance=Math.hypot(x-player.x,z-player.z),steps=Math.max(1,Math.ceil(distance/.25));for(let i=1;i<=steps;i++)if(!vehicleClear(player.x+(x-player.x)*i/steps,player.z+(z-player.z)*i/steps,angle))return false;return true;}
let lastSafe={x:-52,z:32},stuckSeconds=0;
function settleSpawn(){if(!active||driving||!blocked(player.x,player.z))return false;const open=nearestOpenPoint(player.x,player.z,blocked,{radius:6,step:.25});if(!open)return false;player.x=open.x;player.z=open.z;s.x=player.x;s.z=player.z;locomotion.x=locomotion.z=0;return true;}
function recoverPosition(){if(!active||net.role==='guest'||ensurePolice().search||ensurePolice().officers.some(c=>c.target===localPoliceRole()&&c.mode!=='patrol')){toast('Recovery is unavailable during a police encounter or as a guest.');return;}if(!blocked(player.x,player.z)){toast('Your position is clear. Use the map for directions.');return;}if(!blocked(lastSafe.x,lastSafe.z)){driving=false;driveSpeed=0;player.set(lastSafe.x,1.72,lastSafe.z);locomotion.x=locomotion.z=0;close();resetPlayerView();save();toast('Returned to your last clear position.');return;}if(settleSpawn()){close();resetPlayerView();save();toast('Moved to the nearest open ground.');}}window.recoverPosition=recoverPosition;
const update11=update;update=function(dt){update11(dt);if(active&&!blocked(player.x,player.z)){lastSafe={x:player.x,z:player.z};stuckSeconds=0;}else if(active)stuckSeconds+=dt;};
const load11=load;load=function(...args){load11(...args);customerPaths.clear();copPaths.clear();if(!blocked(player.x,player.z))lastSafe={x:player.x,z:player.z};};window.loadGame=load;
const network11=networkTick;networkTick=function(dt){network11(dt);if(other&&!visualActors.some(a=>a.g===other)){const variant=other.userData.id%3;if(citizenTemplates[variant])installCitizen(citizenTemplates[variant],variant);}};
function validPose(p){return p&&[p.x,p.z,p.yaw].every(Number.isFinite)&&p.x>=WORLD.minX&&p.x<=WORLD.maxX&&p.z>=WORLD.minZ&&p.z<=WORLD.maxZ;}
function validSharedState(v){return v&&v.version===3&&validCargo(v.crafterCargo,STRAINS.length)&&['cash','bank','xp','x','z','day','time'].every(k=>Number.isFinite(v[k]))&&['seeds','raw','gummies','packs'].every(k=>Array.isArray(v[k])&&v[k].length>=6&&v[k].length<=STRAINS.length&&v[k].every(n=>Number.isFinite(n)&&n>=0))&&Array.isArray(v.plants)&&v.plants.length<=8&&Array.isArray(v.deals)&&v.threads&&typeof v.threads==='object';}
function locationVisitAccess(key,actor,inVehicle=false){
 if(typeof key!=='string'||!locationMemoryCopy({},key)||inVehicle)return null;
 return points.find(p=>locationKeyForType(p.type)===key&&pointVisible(p)&&pointApproach(actor,p,blocked,floorHeight,3))||null;
}
function remoteActionAllowed(msg){if(!net.remote||![net.remote.x,net.remote.z,msg.x,msg.z].every(Number.isFinite)||Math.hypot(net.remote.x-msg.x,net.remote.z-msg.z)>3)return false;const k=msg.k;
 if(k==='visitPlace'){
  if(!freshExchangePose(net.remote,msg,net.peerPoseSeenAt,performance.now()))return false;
  const peer={x:net.remote.x,z:net.remote.z,y:Number.isFinite(net.remote.y)?net.remote.y:1.72+floorHeight(net.remote.x,net.remote.z)},claimed={x:msg.x,z:msg.z,y:peer.y};
  return !!locationVisitAccess(msg.a,peer,net.remote.vehicle)&&!!locationVisitAccess(msg.a,claimed,net.remote.vehicle);
 }
 if(['sample','deliver'].includes(k)){
  if(!Number.isInteger(msg.a)||!CONTACTS[msg.a]||net.remote.vehicle||!freshExchangePose(net.remote,msg,net.peerPoseSeenAt,performance.now()))return false;
  const peer={x:net.remote.x,z:net.remote.z,y:Number.isFinite(net.remote.y)?net.remote.y:1.72+floorHeight(net.remote.x,net.remote.z)},claimed={x:msg.x,z:msg.z,y:peer.y};
  return exchangeAccess(peer,CONTACTS[msg.a],blocked,floorHeight).ok&&exchangeAccess(claimed,CONTACTS[msg.a],blocked,floorHeight).ok;
 }
 if(actionPointTypes(k,msg.a)!==null){
  if(!freshExchangePose(net.remote,msg,net.peerPoseSeenAt,performance.now()))return false;
  const peer={x:net.remote.x,z:net.remote.z,y:Number.isFinite(net.remote.y)?net.remote.y:1.72+floorHeight(net.remote.x,net.remote.z)},claimed={x:msg.x,z:msg.z,y:peer.y};
  return physicalActionAccess(k,msg.a,peer,net.remote.vehicle).ok&&physicalActionAccess(k,msg.a,claimed,net.remote.vehicle).ok;
 }
 if(['list','text','offer','cancelDeal','payment','complyPolice','dropProp','throwProp'].includes(k))return true;
 const mapping={placeTent:'tent',pickup:'litter',grabProp:'prop'},type=mapping[k];if(!type)return false;
 return points.some(p=>p.type===type&&pointVisible(p)&&Math.hypot(msg.x-p.x,msg.z-p.z)<=5&&(type!=='tent'||p.i===msg.a)&&(type!=='customer'||p.i===msg.a)&&(type!=='litter'||p.id===msg.a));
}
let guestSequence=0,pendingCommands=new Map(),committedRemoteExchange=null;
const send11=netSend;netSend=function(msg){if(msg.type==='action'&&net.role==='guest'){if(!net.connected){toast('Reconnect to the host first.');return;}send11({type:'position',player:playerPacket()});msg={...msg,seq:++guestSequence};if(pendingCommands.size>=128)pendingCommands.delete(pendingCommands.keys().next().value);pendingCommands.set(msg.seq,{at:performance.now(),exchange:exchangeRequest(msg,s,STRAINS.length)});}send11(msg);};
const wire11=wireChannel;wireChannel=function(ch){wire11(ch);const oldMessage=ch.onmessage,oldClose=ch.onclose;let lastCommand=0;guestSequence=0;pendingCommands.clear();net.peerPoseSeenAt=null;
 ch.onmessage=e=>{if(net.ch!==ch)return;let m;try{m=JSON.parse(e.data);}catch{return;}
  if(m.type==='ack'){const pending=pendingCommands.get(m.seq);pendingCommands.delete(m.seq);if(m.error)toast(m.error);else if(net.role==='guest'&&net.connected&&pending){const receipt=matchExchangeReceipt(m.exchange,pending.exchange,performance.now()-pending.at,STRAINS.length);if(receipt)startExchangeGesture(receipt);}return;}
  if(['welcome','state'].includes(m.type)&&net.role==='guest'&&!validSharedState(m.state)){toast('Invalid shared state ignored. Reconnect if this continues.');return;}
  if(m.type==='position'&&(!validPose(m.player)||m.player.y!==undefined&&!Number.isFinite(m.player.y)))return;
  if(m.type==='position'&&net.role==='host')net.peerPoseSeenAt=performance.now();
  if(m.type==='state'&&m.player&&!validPose(m.player))return;if(m.type==='state'&&net.role==='guest')net.workerSeenAt=performance.now();
  if(m.type==='action'&&net.role==='host'){
   if(!Number.isSafeInteger(m.seq)||m.seq<=0)return;
   if(m.seq<=lastCommand){send11({type:'ack',seq:m.seq});return;}
   lastCommand=m.seq;
   if(!remoteActionAllowed(m)){send11({type:'ack',seq:m.seq,error:['sample','deliver'].includes(m.k)?'Meet the customer with a clear path, leave the van and retry. A fresh peer position is required.':'Move to the correct shop or workstation and try again.'});return;}
   committedRemoteExchange=null;oldMessage(e);const exchange=committedRemoteExchange;committedRemoteExchange=null;send11({type:'ack',seq:m.seq,...(exchange?{exchange}:{})});return;
  }
  oldMessage(e);
 };
 ch.onclose=()=>{if(net.ch!==ch)return;oldClose?.();net.peerPoseSeenAt=null;pendingCommands.clear();keys={};if(net.role==='guest'){if(stationTask)cancelStation();menu('network');toast('Host disconnected. Shared actions are paused; your personal saves are safe.');}};
};
// Loud running or a moving van draws attention only nearby and through an unobstructed path.
const police12=tickPolice;tickPolice=function(dt){dt=Number.isFinite(dt)?Math.max(0,Math.min(.06,dt)):0;police12(dt);if(net.role==='guest')return;if(firstSaleProtected(s))return;if(!s.made&&!s.sold&&!curfewActive(s.time))return;const p=ensurePolice();if(p.cooldown||p.search)return;const loud=driving?Math.abs(driveSpeed)>5:!!(walk&&keys.shift);if(loud)for(const cop of p.officers)if(cop.mode==='patrol'&&!cop.squad&&Math.hypot(cop.x-player.x,cop.z-player.z)<(driving?14:7)&&copSight(cop,player)){cop.target='host';cop.angle=Math.atan2(player.x-cop.x,player.z-cop.z);cop.suspicion=Math.min(100,cop.suspicion+dt*12);}};
const menu12=menu;menu=function(which,data){menu12(which,data);if(which==='pause')$('modal').innerHTML+=row('Position recovery','Use only if you are inside blocked geometry. Unavailable during police encounters.','Recover position','recoverPosition()',!blocked(player.x,player.z));if(which==='network')$('modal').innerHTML+='<p class="note">Commands use receipts and duplicate protection. A guest must be at the relevant shop or station. If disconnected, rejoin with a new invite; the host’s save is authoritative.</p>';};window.menu=menu;

// Optional low-detail rigs keep the same skeleton and animation clips.
const citizenLow=[];
if(typeof GLTFLoader!=='undefined')for(let i=0;i<3;i++)new GLTFLoader().load('./assets/citizen-lod-v12-'+i+'.glb',g=>{if(g.animations.some(c=>c.name==='Walk')&&g.scene.getObjectByProperty('isSkinnedMesh',true)){roundResidentAsset(g);citizenLow[i]=g;}},undefined,()=>{});
function prepareActorLOD(a){if(a.high||!citizenLow[a.g.userData.id%3])return;const source=citizenLow[a.g.userData.id%3],body=cloneRig(source.scene),materials=new Map();body.scale.copy(a.body.scale);a.body.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material])materials.set(m.name,m);});body.traverse(o=>{if(!o.isMesh)return;o.material=Array.isArray(o.material)?o.material.map(m=>materials.get(m.name)||m):materials.get(o.material.name)||o.material;o.castShadow=quality==='high';o.receiveShadow=true;o.frustumCulled=false;});concealSculptedResident(body);const clothing=createResidentClothing({body,id:a.g.userData.id,baseColor:a.clothingBase,isCop:a.isCop}),head=body.getObjectByName('Head'),oldHead=a.body.getObjectByName('Head');let expression=null,hairstyle=null;if(head&&oldHead){for(const c of oldHead.children)if(c.isMesh&&c!==a.hairstyle?.mesh&&!c.name.startsWith('ResidentFacialHair-'))head.add(c.clone());expression=createResidentExpressionRig({head,hairColor:a.expressionHair,skinColor:a.expressionSkin});hairstyle=createResidentHairstyleRig({head,id:a.g.userData.id,hairColor:a.expressionHair});if(head.children.some(c=>c.name==='Street hat'))hairstyle.mesh.visible=false;}const proportions=createResidentProportionRig({body,id:a.g.userData.id});applyResidentProportionRig(proportions);const mixer=new THREE.AnimationMixer(body),actions={};for(const clip of source.animations)actions[clip.name]=mixer.clipAction(clip);a.high={body:a.body,mixer:a.mixer,actions:a.actions,expression:a.expression,hairstyle:a.hairstyle,proportions:a.proportions,clothing:a.clothing};a.low={body,mixer,actions,expression,hairstyle,proportions,clothing};body.visible=false;a.g.add(body);}
function selectActorLOD(a){prepareActorLOD(a);if(!a.high)return;const distance=a.g.position.distanceTo(camera.position),threshold=quality==='performance'?14:quality==='high'?45:25;const chosen=distance>threshold+(a.body===a.low.body?-2:2)?a.low:a.high;if(chosen.body===a.body)return;const current=a.current,time=a.actions[current]?.time||0;a.body.visible=false;a.mixer.stopAllAction();Object.assign(a,chosen);if(a.actions[current]){a.actions[current].reset().play();a.actions[current].time=time;}else a.current=null;}
let audioLevels={master:.8,effects:.8,ambience:.4},ambientGain=null;
try{const levels=JSON.parse(localStorage.getItem('gummybay-audio')||'{}');for(const k of Object.keys(audioLevels))if(Number.isFinite(levels[k]))audioLevels[k]=Math.max(0,Math.min(1,levels[k]));}catch{}
function setVolume(key,value){if(!(key in audioLevels)||!Number.isFinite(value))return;audioLevels[key]=Math.max(0,Math.min(1,value));try{localStorage.setItem('gummybay-audio',JSON.stringify(audioLevels))}catch{toast('Audio setting applies for this session.')}updateAmbience();}window.setVolume=setVolume;
const tone11=playTone;playTone=function(hz,duration,volume){if(audioLevels.master*audioLevels.effects<=0)return;tone11(hz,duration,volume*audioLevels.master*audioLevels.effects);};
function updateAmbience(){if(!ambientGain||!audioContext)return;const indoors=s.room&&Math.abs(player.x-HOMES[s.house].x)<HOMES[s.house].w/2&&Math.abs(player.z-HOMES[s.house].z)<HOMES[s.house].d/2;ambientGain.gain.setTargetAtTime(active&&soundEnabled?audioLevels.master*audioLevels.ambience*(indoors?.009:.025):0,audioContext.currentTime,.3);}
addEventListener('pointerdown',()=>{if(!audioContext||ambientGain)return;try{const buffer=audioContext.createBuffer(1,audioContext.sampleRate*4,audioContext.sampleRate),data=buffer.getChannelData(0);let previous=0;for(let i=0;i<data.length;i++){previous=(previous+.025*(Math.random()*2-1))/1.025;data[i]=previous*6;}const source=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter();source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=700;ambientGain=audioContext.createGain();ambientGain.gain.value=0;source.connect(filter);filter.connect(ambientGain);ambientGain.connect(audioContext.destination);source.start();updateAmbience();}catch{ambientGain=null;}});
let showRenderStats=false,frameSamples=[],lastSample=0;
const render12=renderFrame;renderFrame=function(){for(const a of visualActors)selectActorLOD(a);render12();updateAmbience();const t=performance.now();if(lastSample&&t>lastSample){frameSamples.push(t-lastSample);if(frameSamples.length>120)frameSamples.shift();}lastSample=t;if(showRenderStats){const average=frameSamples.reduce((a,b)=>a+b,0)/Math.max(1,frameSamples.length),info=renderer.info?.render;$('perfStats').textContent=average.toFixed(1)+' ms frame interval · '+(info?.calls??'?')+' draws · '+(info?.triangles??'?')+' triangles · '+quality;}};
function toggleRenderStats(){showRenderStats=!showRenderStats;let el=document.getElementById('perfStats');if(!el){el=document.createElement('div');el.id='perfStats';el.style.cssText='position:fixed;left:12px;bottom:12px;z-index:40;background:#152a25e8;color:#eef6e5;padding:8px;font:12px monospace;pointer-events:none';document.body.appendChild(el);}el.hidden=!showRenderStats;}window.toggleRenderStats=toggleRenderStats;
const settings12=menu;menu=function(which,data){settings12(which,data);if(which==='settings')$('modal').innerHTML+='<h3>Audio mix</h3>'+Object.keys(audioLevels).map(k=>'<label style="display:block;margin:12px 0">'+k+' <input aria-label="'+k+' volume" type="range" min="0" max="1" step="0.05" value="'+audioLevels[k]+'" oninput="setVolume(\''+k+'\',Number(this.value))"></label>').join('')+row('Rendering diagnostics','Rolling frame interval and renderer counts on this device. This is not a controlled benchmark.','Toggle display','toggleRenderStats()')+'<p class="note">Balanced uses detailed characters nearby and simplified animated rigs beyond 25 metres. Performance switches at 14 metres; High at 45 metres. Audio starts after a click.</p>';};window.menu=menu;

// V13: inventory-backed workshop staging and camera comfort. No save schema changes.
const comfort=restoreComfort((()=>{try{return localStorage.getItem('gummybay-comfort')}catch{return null}})());
function setComfort(key,value){if(!(key in comfort))return;comfort[key]=!!value;if(active){if(key==='bob'){hand.position.y=0;syncPlayerView();}if(key==='sprintFov'&&!comfort.sprintFov){camera.fov=fovBase;camera.updateProjectionMatrix();}}try{localStorage.setItem('gummybay-comfort',JSON.stringify(comfort))}catch{toast('Comfort setting applies for this session; browser saving is unavailable.')}}
window.setComfort=setComfort;
const workshopDisplays=[];
const stockMaterial=mat(0xb58c5f,{roughness:.94}),trayMaterial=mat(0x7eaaa5,{roughness:.34,metalness:.55});
for(const [home,h] of HOMES.entries()){
 const group=new THREE.Group();scene.add(group);
 const packs=[],gummies=[],inputs=[];
 for(let i=0;i<12;i++){
  const p=box(h.x-2.23+(i%4)*.28,.52+Math.floor(i/4)*.65,h.z+4,.27,.24,.22,0xb58c5f,false,group);p.material=stockMaterial;packs.push(p);
  const g=sphere(h.x+5.7+(i%4)*.25,1.40,h.z+2.75+Math.floor(i/4)*.22,.095,0x93c35b,group,1,.65,1);gummies.push(g);
 }
 for(let i=0;i<4;i++){const p=cyl(h.x+4.05+i*.28,1.24,h.z+3.4,.11,.45,0x93c35b,group);inputs.push(p);}
 const tray=box(h.x+6.1,1.33,h.z+3,1.3,.045,.9,0x7eaaa5,false,group);tray.material=trayMaterial;
 const labels=[sign('01  SHAPE',h.x+6.1,2.25,h.z+2.4,2,'#254f55','#fff1ca',0,{dynamic:true}),sign('02  WRAP',h.x+7.9,2.25,h.z+2.4,1.4,'#765a36','#fff1ca',0,{dynamic:true}),sign('03  STOCK',h.x-1.8,2.45,h.z+4,1.5,'#405b42','#fff1ca',0,{dynamic:true})];
 group.visible=false;labels.forEach(l=>l.visible=false);workshopDisplays.push({home,group,packs,gummies,inputs,labels});
}
const focusRing=new THREE.Mesh(new THREE.RingGeometry(.32,.37,32),new THREE.MeshBasicMaterial({color:0xd8e9a1,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));focusRing.rotation.x=-Math.PI/2;scene.add(focusRing);
function refreshWorkshop(){
 const stored=stockDisplay(s.storedPacks),loose=stockDisplay(s.gummies),raw=stockDisplay(s.raw,4);
 for(const d of workshopDisplays){const visible=active&&s.room&&d.home===s.house;d.group.visible=visible;if(d.supply)d.supply.visible=visible;d.labels.forEach(l=>l.visible=visible);if(!visible)continue;
  for(const [meshes,stock] of [[d.packs,stored],[d.gummies,loose],[d.inputs,raw]])meshes.forEach((m,i)=>{m.visible=i<stock.slots.length;if(m.visible){m.material=mat(STRAINS[stock.slots[i]].color,{roughness:meshes===d.gummies?.22:meshes===d.packs?.94:.65,metalness:0});m.userData.stockType=stock.slots[i];}});
  // Repaint the existing three sign textures only when stock changes. These
  // displays never create, reserve or consume an item, including worker cargo.
  for(const [index,title,stock] of [[0,'SHAPE',raw],[1,'WRAP',loose],[2,'STORED',stored]]){
   const label=d.labels[index],capacity=index===2?' / '+storageCapacity():'';
   const heading=title+'  '+stock.total+capacity;
   const detail=stock.total?(stock.slots.length+' SHOWN'+(stock.hidden?'  +'+stock.hidden+' MORE':'')):'EMPTY';
   const key=heading+'|'+detail;if(label.userData.stockKey===key)continue;
   label.userData.stockKey=key;
   const texture=label.material.map,c=texture.image.getContext('2d');
   label.userData.signLayout=drawStockBoard(c,heading,detail,['#254f55','#765a36','#405b42'][index]);texture.needsUpdate=true;
  }
 }
}
const ui13=updateUI;updateUI=function(){ui13();refreshWorkshop();paintHotbarSelection();
};
const stationPaint13=paintStation;paintStation=function(){stationPaint13();if(!stationTask)return;const t=stationTask,progress=Math.round(taskFraction(t,MANUAL[t.k])*100);$('stationHUD').insertAdjacentHTML('beforeend','<p class="station-summary">'+progress+'% complete · Supplies stay yours until completion.</p>');};
// Different tools and visible material movement for each existing production task.
const syrupStream=cyl(0,-.2,-1.04,.015,.22,0xd8ba70,stationView);syrupStream.material=mat(0xd8ba70,{roughness:.2});syrupStream.material=syrupStream.material.clone();syrupStream.material.depthTest=false;syrupStream.renderOrder=51;
const render13=renderFrame;renderFrame=function(){
 // Update visual state before the existing renderer draws it.
 focusRing.visible=active&&!panel&&!!near&&['craft','mix','sink','stockroom','tent'].includes(near.type);
 if(focusRing.visible)focusRing.position.set(near.x,floorHeight(near.x,near.z)+.035,near.z);
 syrupStream.visible=false;
 if(stationTask){const t=stationTask,steps=MANUAL[t.k],f=taskFraction(t,steps),packing=t.k==='pack';
  stationWrapper.visible=packing||t.k==='make';stationWrapper.scale.set(1,packing&&t.step>0?1+f*4:1,1);
  stationTool.visible=['mix','prepare','water','fill'].includes(t.k);stationTool.rotation.z+=((stationHeld||stationAssist?-.65:0)-stationTool.rotation.z)*.18;
  syrupStream.visible=(stationHeld||stationAssist)&&['mix','water','fill','prepare'].includes(t.k)&&steps[t.step][1]==='hold';
  stationPiece.position.x=packing?-.18+Math.min(1,f*2)*.41:-.18;
  stationPiece.scale.set(1,packing?Math.max(.35,1-f*.5):1,1);
 }
 render13();
};
const settings13=menu;menu=function(which,data){settings13(which,data);if(which==='settings')$('modal').innerHTML+='<h3>Camera comfort</h3>'+['bob','sprintFov','stationFocus'].map(k=>'<label class="comfort-option"><input type="checkbox" '+(comfort[k]?'checked':'')+' onchange="setComfort(\''+k+'\',this.checked)"> '+(k==='bob'?'Walking camera and hand bob':k==='sprintFov'?'Sprint field-of-view change':'Face the work surface when starting a task')+'</label>').join('')+'<label class="comfort-option">Field of view <input type="range" min="60" max="100" step="1" value="'+fovBase+'" oninput="setFov(Number(this.value))"></label><label class="comfort-option">Head bob <input type="range" min="0" max="100" step="5" value="'+Math.round(bobAmount*100)+'" oninput="setBobAmount(Number(this.value)/100)"></label>';if(which==='phone')$('modal').innerHTML+='<section class="staffcard"><h3>Business at a glance</h3><p>'+s.packs.reduce((a,b)=>a+b,0)+' carried packs · '+storedUsed()+' stored · '+s.deals.length+' active deliveries</p><button class="primary" onclick="menu(\'deals\')">Delivery commitments</button></section>';};window.menu=menu;
// Clear continuous input on pointer cancellation and Study Desk transitions.
function releaseGameInput(){keys={};stationHeld=false;stationAssist=false;drag=false;locomotion.x=locomotion.z=0;locomotion.space=false;locomotion.jumpQueued=0;last=0;feelLast=visualPrevious=performance.now();}
addEventListener('pointercancel',releaseGameInput);addEventListener('blur',releaseGameInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseGameInput();});
addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='study-visibility')return;releaseGameInput();if(!e.data.visible){save();document.exitPointerLock?.();audioContext?.suspend().catch(()=>{});} });

// V14: accessible production, truthful displays and protected storage/order actions.
let stationAssist=false;
function stationControl(down){if(!stationTask)return;if(isTimedSeal()){stationAssist=false;if(down)pressSeal();return;}const step=MANUAL[stationTask.k][stationTask.step];stationAssist=down;if(down&&step[1]==='tap'){advanceStation(1);stationAssist=false;}}
window.stationControl=stationControl;
addEventListener('keydown',e=>{if(!stationTask||e.code!=='Space'||e.target?.closest?.('input,textarea,select,button,[contenteditable]'))return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)stationControl(true);},true);
addEventListener('keyup',e=>{if(e.code==='Space')stationAssist=false;},true);
for(const name of ['blur','pointerup','pointercancel'])addEventListener(name,()=>stationAssist=false);
const cancel13=cancelStation;cancelStation=function(){stationAssist=false;cancel13();};window.cancelStation=cancelStation;
const paint14=paintStation;paintStation=function(){paint14();if(!stationTask)return;const step=MANUAL[stationTask.k][stationTask.step];$('stationHUD').insertAdjacentHTML('beforeend','<button id="stationAssist" class="primary" type="button">'+(step[1]==='tap'?'Press':'Hold')+' here or Space</button><p class="note">Keyboard and touch alternative. Esc cancels without consuming supplies.</p>');};
// Delegated events survive progress-panel replacement without losing held input.
$('stationHUD').addEventListener('pointerdown',e=>{if(!e.target.closest('#stationAssist'))return;e.preventDefault();e.stopPropagation();stationControl(true);});
function updateStationInput(dt){
 if(!active||!stationTask||document.hidden)return;
 stationTask.elapsed+=Math.min(.06,dt);
 if(isTimedSeal()){const marker=document.getElementById('sealCursor');if(marker)marker.style.left=(sealPosition(stationTask.elapsed)*100)+'%';return;}
 const step=MANUAL[stationTask.k][stationTask.step];
 if(step[1]==='hold'&&(stationHeld||stationAssist))advanceStation(Math.min(.06,dt));
 else if(step[1]==='drag'&&stationAssist)advanceStation(Math.min(.06,dt)*180);
}

const agree13=agree;agree=function(i,price){const t=s.threads[i];if(!t||t.status!=='negotiating'||s.deals.some(d=>d.npc===i)||s.packs[t.t]-reservedQty(t.t)<t.qty)return;agree13(i,price);};
const placement13=placementValid;placementValid=function(i,p){if(!placement13(i,p))return false;return !points.some(q=>q.home===s.house&&['craft','sink','mix','stockroom'].includes(q.type)&&Math.abs(q.x-p.x)<2.2&&Math.abs(q.z-p.z)<2.2);};
function stationStatus(){if(stationTask)return 'Working';if(!s.room)return 'Rent a workshop';if(!s.packStation)return 'Packaging station needed';if(!s.wrappers)return 'Missing wrappers';if(stockUsed()>=stockCapacity())return 'Stock full — sell or store existing goods';if(!s.raw.some(n=>n)&&!s.gummies.some(n=>n))return 'Waiting for harvest';return 'Ready';}
const menu14=menu;menu=function(which,data){menu14(which,data);
 if(which==='craft')$('modal').insertAdjacentHTML('afterbegin','<div class="machine-status">Worktable · '+stationStatus()+'</div>');
 if(which==='stockroom'){
  $('modal').insertAdjacentHTML('afterbegin','<p class="note">Flavour-coloured shelf packs preview up to 12 stored items, with different flavours shown before repeats. The shelf sign gives the exact total and the extra packs beyond the preview. Use the named rows below for every flavour and exact transfers. Promised deliveries stay in your bag.</p>');
  for(let i=0;i<STRAINS.length;i++){let reserved=reservedQty(i),free=Math.max(0,s.packs[i]-reserved),room=Math.max(0,storageCapacity()-storedUsed()),store=Math.min(free,room),take=s.storedPacks[i];if(!free&&!take&&!reserved)continue;
   $('modal').innerHTML+=row(STRAINS[i].name+' · '+reserved+' reserved',free+' available to store · '+take+' stored','Store '+store,`action('stash',${i},${store})`,!store)+row('Collect '+STRAINS[i].name,'Move the stored packs to your bag.','Collect '+take,`action('unstash',${i},${take})`,!take);
  }
 }
 if(which==='journal')$('modal').innerHTML+='<section class="staffcard"><h3>First batch budget: $350</h3><p>Room $75 · tent $100 · can $15 · trimmers $10 · packaging station $100 · Pine Pop seed $30 · soil $10 · 10 wrappers $10. You keep $50. Water is free at your sink.</p><p>Harvest four units, shape and wrap them, then list only unreserved packs. One four-pack sale earns 20 XP; level 2 needs 30 XP. The $220 press unlocks four-item batches after level 2. Grow and sell another crop to work towards it.</p><button class="primary" onclick="trackPlace(\'hardware\')">Find equipment</button></section>';
 if(which==='helpers')$('modal').innerHTML+='<p class="note">Pause preserves carried worker stock. To recover it, switch the gummy maker to Background timer and resume ordinary play; unfinished supplies are returned, finished packs go into your bag.</p><p class="note">A new gummy maker walks supplies to the worktable and finished packs to storage. A new gardener walks between tents, and a new seller walks an agreed order to the customer. Switch any of them to Background timer for the old instant loop.</p>';
};window.menu=menu;

// Milestone: one authoritative completion path for shaped, packed and mixed stock.
const actions16=doAction;doAction=function(k,a,b,c){
 const request=k==='batch'?a:['make','pack','mix'].includes(k)?{kind:k,index:a,count:1,ingredient:b??0}:null;
 if(request){if(ensurePolice().search)return;const result=commitProduction(s,request,BASE_COUNT,INGREDIENTS.length);if(!result.ok){toast(result.reason+' Nothing was consumed.');return;}let mixXp=0;if(result.kind==='mix'){const strain=STRAINS[result.result];s.knownRecipes??={};const key=strain.recipeKey||'';mixXp=key?mixExperience(!!s.knownRecipes[key]):0;if(key)s.knownRecipes[key]=true;s.xp+=mixXp-2*result.count;emitGameplay({type:'mix',product:result.result,base:strain.base,ingredient:strain.ingredient,effects:strain.effects||[],recipe:strain.recipe,xp:mixXp,count:result.count});}save();if(!processingRemote){playTone(result.kind==='pack'?480:result.kind==='mix'?340:620,.12,.03);const strain=STRAINS[result.result];toast(result.kind==='mix'?strain.name+' · '+(strain.effects||[]).join(', ')+' · '+cash(value(result.result))+(mixXp?' · +'+mixXp+' XP':''):result.count+' '+strain.name+' '+(result.kind==='pack'?'packed':'ready')+'.');}return;}
 actions16(k,a,b,c);
};
const batch16=batchReady;batchReady=function(q){return !ensurePolice().search&&!!q&&productionPlan(s,q,BASE_COUNT,INGREDIENTS.length).ok;};
const load16=load;load=function(modeIn,slotIn=1,newRun=false){
 if(!newRun){let raw;try{raw=localStorage.getItem('gummybay-v3-'+modeIn+'-'+slotIn);}catch{toast('Browser storage is unavailable. Existing slots have not been changed.');return;}
  if(raw!==null){let old;try{old=JSON.parse(raw)}catch{toast('This slot contains unreadable data. It was not overwritten. Export the raw slot from the save screen.');return;}const check=validateSave(old,STRAINS.length,WORLD);if(!check.ok||!validCargo(old.crafterCargo,STRAINS.length)||old.mode!==modeIn){toast('Save not loaded: '+(check.reason||'mode mismatch')+' Original data kept.');return;}}
 }load16(modeIn,slotIn,newRun);
};window.loadGame=load;
function downloadRawSlot(modeIn,slotIn){try{const data=localStorage.getItem('gummybay-v3-'+modeIn+'-'+slotIn);if(data===null){toast('This slot is empty.');return;}const url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='gummybay-'+modeIn+'-'+slotIn+'-raw.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{toast('Unable to read this slot.');}}window.downloadRawSlot=downloadRawSlot;
const slots16=slots;slots=function(modeIn){slots16(modeIn);$('modal').innerHTML+='<h3>Recover a save</h3><p class="note">Download the original slot data even if it cannot be loaded. This never replaces your progress.</p>'+[1,2,3].map(i=>'<button class="ghost" onclick="downloadRawSlot(\''+modeIn+'\','+i+')">Export slot '+i+'</button>').join(' ');};window.slots=slots;
const import16=confirmImport;confirmImport=function(){if(!pendingReset)return;const check=validateSave(pendingReset.state,STRAINS.length,WORLD);if(!check.ok||!validCargo(pendingReset.state.crafterCargo,STRAINS.length)){toast('Import rejected: '+(check.reason||'invalid worker cargo'));return;}try{backupSlot(localStorage,'gummybay-v3-'+pendingReset.state.mode+'-'+slot);}catch{toast('Import cancelled: the existing slot could not be backed up. Export it first.');return;}import16();resetSystems();};window.confirmImport=confirmImport;
const milestoneMenu=menu;menu=function(which,data){milestoneMenu(which,data);
 if(which==='deals'){
  const plan=deliveryRound(s,CONTACTS,{x:player.x,z:player.z}),orders=plan.rows,total=orders.reduce((n,d)=>n+d.total,0);
  $('modal').innerHTML='<button class="close" onclick="closeMenu()">×</button><div class="overline">PHONE / DELIVERY ROUND</div><h2>'+orders.length+' commitments · '+cash(total)+'</h2><p>Promised stock stays in your bag until delivery. Orders below are sorted by deadline.</p>';
  if(!orders.length)$('modal').innerHTML+='<p>No deliveries booked. Pack a gummy, create a listing and message a customer.</p><button class="primary" onclick="menu(\'listing\')">Create listing</button>';
  if(plan.next){const n=plan.next,person=CONTACTS[n.npc],cta=n.action==='deliver'?'Track '+person.name:'Find worktable';$('modal').innerHTML+='<section class="staffcard"><div class="overline">NEXT '+(n.action==='deliver'?'STOP':'TASK')+'</div><h3>'+esc(person.name)+' · '+esc(STRAINS[n.t].name)+'</h3><p>'+esc(n.reason)+' · '+Math.round(n.distance)+' m away</p><button class="primary" onclick="trackNextDelivery()">'+esc(cta)+'</button></section>';}
  for(const d of orders){const person=CONTACTS[d.npc],next=plan.next?.npc===d.npc;$('modal').innerHTML+='<section class="order-card '+(d.missing?'needs-stock':'ready')+'"><div class="order-heading"><h3>'+(next?'NEXT · ':'')+esc(person.name)+'</h3><b>'+cash(d.total)+'</b></div><p>'+d.qty+' × '+esc(STRAINS[d.t].name)+'</p><strong>'+(d.missing?d.missing+' packs still needed':'Packed and ready to deliver')+'</strong><p>'+(d.minutesLeft===null?'No deadline':d.minutesLeft+' game minutes left')+' · '+Math.round(d.distance)+' m away</p><p class="note">'+esc(residentStatus(d.npc))+'</p><div class="order-actions"><button class="primary" onclick="trackCustomer('+d.npc+')">Track customer</button><button class="ghost" onclick="menu(\'thread\','+d.npc+')">Messages</button><button class="ghost" onclick="action(\'cancelDeal\','+d.npc+')">Cancel order</button></div></section>';}
 }
 if(which==='craft'){const status=workshopStageStatus(s);$('modal').innerHTML+='<section class="workflow-status" aria-label="Workshop status"><div><small>01 / SHAPE</small><b>'+esc(status.shaping)+'</b></div><div><small>02 / PACKAGE</small><b>'+esc(status.packaging)+'</b></div><div><small>03 / DELIVER</small><b>'+esc(status.delivery)+'</b></div></section><p class="note">'+(s.crafterCargo?'Worker carrying: '+esc(STRAINS[s.crafterCargo.index].name)+' · '+(s.crafterCargo.phase==='input'?'supplies and one wrapper':'one finished pack')+'. This stock is separate from available inventory.':'No stock in transit.')+'</p>'; }
 if(which==='importConfirm')$('modal').innerHTML+='<p class="note">The previous destination slot is backed up locally before replacement. The import is cancelled if that backup cannot be written.</p>';
};window.menu=menu;

// Remove only the old primitive tabletop decorations beneath the new equipment.
for(const h of HOMES)for(const o of [...scene.children])if(o.isMesh&&['BoxGeometry','CylinderGeometry','SphereGeometry','ExtrudeGeometry'].includes(o.geometry.type)&&o.position.y>1.3&&o.position.y<1.9&&Math.abs(o.position.x-(h.x+7))<2&&Math.abs(o.position.z-(h.z+3))<.7)scene.remove(o);
for(const mixer of mixers)attachObjectSilhouette(mixer,'station',{quality});
productionContainers=createProductionContainers({scene,quality});
const productionContainerColors=Object.freeze(STRAINS.map(strain=>strain.color)),productionContainerRender=renderFrame;
renderFrame=function(){productionContainers.update({active,room:s.room,home:s.house,raw:s.raw,gummies:s.gummies,packs:s.packs},productionContainerColors);productionContainerRender();};
const domesticWorkplaceRender=renderFrame;
renderFrame=function(){domesticWorkplace.update({active,room:s.room,home:s.house,can:s.can,trimmers:s.trimmers,packStation:s.packStation,mixer:s.mixer});domesticWorkplaceRender();};
occupationalOutfits=createOccupationalOutfits({scene:retiredPeopleLayer,points,quality});
const occupationalOutfitRender=renderFrame;
renderFrame=function(){occupationalOutfits.update({active});occupationalOutfitRender();};
residentAccessories=createResidentAccessories({scene:retiredPeopleLayer,points,quality});
const residentAccessoryRender=renderFrame;
renderFrame=function(){residentAccessories.update({active});residentAccessoryRender();};
nightSilhouettes=createNightSilhouettes({scene,actors:avatars,quality});
const nightSilhouetteRender=renderFrame;
renderFrame=function(){nightSilhouettes.update({active,time:s.time});nightSilhouetteRender();};
for(const h of HOMES){
 const supply=new THREE.Group();supply.visible=false;supply.position.set(h.x,0,h.z);scene.add(supply);
 box(4.5,.98,3.4,1.5,.08,.8,0x688780,false,supply);
 for(const x of [3.85,5.15])for(const z of [3.08,3.72]){box(x,.5,z,.07,.92,.07,0x536562,false,supply);sphere(x,.08,z,.08,0x303a38,supply);}
 const label=sign('SUPPLIES / ROSTER',h.x+4.5,.8,h.z+3.83,1.2,'#365c61');
 addPoint('staffboard','Workshop roster · Assignments and status',h.x+4.5,h.z+5,{home:HOMES.indexOf(h)});
 workshopDisplays[HOMES.indexOf(h)].supply=supply;workshopDisplays[HOMES.indexOf(h)].labels.push(label);
}
// Mainland backdrop replaced by a continuous island coast.
districtHorizon=createDistrictHorizon({scene,bounds:WORLD,quality});
scruffyWelcome=createScruffyWelcome({scene,quality});
const visualPolish=createVisualPolish({scene,camera,homes:HOMES,buildings,reflectionMap});

let placementFailure='';
const auditPlacementAccess=createAccessAudit();
const placement19=placementValid;placementValid=function(i,p){
 placementFailure='';if(!placement19(i,p)){placementFailure='Keep clear of walls, furniture, station approaches and the exit.';return false;}
 const ctx=workerContext(),h=HOMES[s.house];
 const poses=(s.installed||[]).filter(j=>j<maxTents()).map(j=>j===i?{i:j,x:p.x,z:p.z,r:p.r}:{i:j,x:tents[j].position.x,z:tents[j].position.z,r:tents[j].rotation.y});
 const occupied=(x,z)=>staticBlocked(x,z)||poses.some(q=>tentFootprintBlocked(x,z,q.x,q.z,q.r));
 const exit={x:h.x,z:h.z+h.d/2-1};
 const targets=[{...ctx.source,label:'supply trolley'},{...ctx.station,label:'worktable'},{...ctx.storage,label:'stockroom'},
  ...points.filter(q=>q.home===s.house&&['sink','mix'].includes(q.type)).map(q=>({x:q.x,z:q.z,label:q.type==='sink'?'sink':'mixing station'})),
  ...poses.map(q=>({x:q.x+Math.sin(q.r)*1.6,z:q.z+Math.cos(q.r)*1.6,label:'tent '+(q.i+1)+' entrance'}))];
 if(s.crafterCargo)targets.push({...physicalCrafter.position,label:'worker carrying stock'});
 const result=auditPlacementAccess(JSON.stringify([s.house,!!s.room,!!s.mixer,poses,targets,colliders.length]),{exit,targets,bounds:ctx.bounds,blocked:occupied});
 if(!result.ok){placementFailure='Leave a clear route from the exit to the '+result.failed+'. Try rotating or moving the tent.';return false;}
 return true;
};
// Physical stockroom assignment: inventory changes only on the host simulation tick.
const physicalCrafter=new StockroomCrafter();
const physicalGardener=new TentGardener();
const physicalSeller=new StreetSeller();
sign('GRAMPS → PAYPHONE',-53,1.1,30.6,2.6,'#385b60');
box(-53,.45,30.55,.08,.9,.08,0x76634e);box(-53,1.1,30.56,2.65,.7,.06,0x76634e);

const crafterActor=bobble(-25,44,0x547f80,0xc68d6a,0x554638);
crafterActor.visible=false;crafterActor.userData.crew='worker';
const gardenerActor=bobble(-25,42,0x6a8f45,0xc68d6a,0x3e4a32);gardenerActor.visible=false;gardenerActor.userData.crew='worker';
const sellerActor=bobble(-7,27,0xc47b45,0xd8b991,0x4a3424);sellerActor.visible=false;sellerActor.userData.crew='seller';
const cargoBox=box(0,.92,.34,.42,.3,.3,0xb89968,false,crafterActor);cargoBox.userData.gameplayAttachment=true;
for(let variant=0;variant<citizenTemplates.length;variant++)if(citizenTemplates[variant])installCitizen(citizenTemplates[variant],variant);
function workerContext(){const h=HOMES[s.house];return {
 source:{x:h.x+4.5,z:h.z+5},station:{x:h.x+7,z:h.z+5},storage:{x:h.x,z:h.z+4},
 bounds:{minX:h.x-h.w/2+1,maxX:h.x+h.w/2-1,minZ:h.z-h.d/2+1,maxZ:h.z+h.d/2-1},
 blocked:(x,z)=>blocked(x,z)||(s.installed||[]).some(i=>{const g=tents[i],p=g?.position;return p&&tentFootprintBlocked(x,z,p.x,p.z,g.rotation.y);}),
 occupied:!!stationTask||!!placeMode,capacity:storageCapacity(),full:()=>storedUsed()>=storageCapacity()
};}
function gardenContext(){const base=workerContext(),limit=maxTents(),cfg=s.staffConfig.gardener,tents=[];
 for(let i=0;i<limit;i++){if(!(s.installed||[]).includes(i)||(cfg.tent>=0&&cfg.tent!==i))continue;const pose=activeTentPose(i);if(!pose)continue;tents.push({i,approach:{x:pose.x+Math.sin(pose.r)*1.6,z:pose.z+Math.cos(pose.r)*1.6}});}
 return {origin:base.source,bounds:base.bounds,blocked:base.blocked,tents,maxTents:limit,roomForHarvest:()=>stockUsed()+4<=stockCapacity(),unlocked,growMs:t=>STRAINS[t].time*(1-(s.lights||0)*.15)*500};
}
function sellerContext(){return {contacts:CONTACTS,meeting:i=>customerHomes[i],route:citizenRoute,blocked:(x,z)=>blocked(x,z),approach:6};}
function placeFieldActor(actor,position,dt){const dx=position.x-actor.position.x,dz=position.z-actor.position.z;if(Math.hypot(dx,dz)>.001)actor.rotation.y=turnTowards(actor.rotation.y,Math.atan2(dx,dz),dt);actor.position.set(position.x,0,position.z);}
let cravingAskTimer=0;
function recordCravingSale(npc,product,qty){
 s.cravings=noteSale(s.cravings,npc,product,qty,s.day,s.time);
 emitGameplay({type:'craving-changed',npc,product,qty,level:s.cravings[npc]?.level??0,day:s.day,time:s.time});
}
function postCravingAsks(){
 let posted=false;
 for(let i=0;i<CONTACTS.length;i++){
  const rec=s.cravings?.[i],thread=s.threads[i];
  const ask=cravingAsk(rec,{day:s.day,time:s.time,hasDeal:s.deals.some(d=>d.npc===i),threadStatus:thread?.status});
  if(!ask||!STRAINS[ask.t])continue;
  const text=ask.qty>1?'I need two '+STRAINS[ask.t].name+'. Text me a price before the night gets away.':'I need a '+STRAINS[ask.t].name+'. Text me a price when you have one packed.';
  if(!thread)s.threads[i]={status:'idle',messages:[{mine:false,text}]};
  else{if(thread.status==='sold'||thread.status==='closed'||thread.status==='cancelled')thread.status='idle';(thread.messages??=[]).push({mine:false,text});}
  s.cravings[i]=markAsked(s.cravings[i],s.day,s.time);
  emitGameplay({type:'craving-ask',npc:i,product:ask.t,qty:ask.qty,level:ask.level,text});
  posted=true;
 }
 if(posted)save();
}
let starterWait=0;
function maybeStarterOffer(dt){
 if(s.starterOffer||s.sold>0||(s.packs[0]||0)<STARTER_QTY||(s.deals||[]).some(d=>d.npc===STARTER_NPC))return;
 starterWait+=dt;if(!starterOfferDue(s,starterWait))return;
 s.starterOffer=true;const text=STARTER_TEXT,thread=s.threads[STARTER_NPC];
 if(!thread)s.threads[STARTER_NPC]={status:'agreed',t:STARTER_PRODUCT,qty:STARTER_QTY,counter:STARTER_PRICE,messages:[{mine:false,text}]};
 else{thread.status='agreed';thread.t=STARTER_PRODUCT;thread.qty=STARTER_QTY;(thread.messages??=[]).push({mine:false,text});}
 s.deals.push({npc:STARTER_NPC,t:STARTER_PRODUCT,qty:STARTER_QTY,price:STARTER_PRICE,due:(s.day-1)*1440+s.time+180});
 emitGameplay({type:'starter-offer',npc:STARTER_NPC,product:STARTER_PRODUCT,qty:STARTER_QTY,price:STARTER_PRICE,text});
 toast('Jules texted. Two Pine Pops, $30 each.');save();
}
const production19=production;production=function(dt){if(ensurePolice().search)return;maybeStarterOffer(dt);production19(dt);if(physicalCrafter.tick(s,dt,workerContext()))save();if(physicalGardener.tick(s,dt,gardenContext()))save();const sale=physicalSeller.tick(s,dt,sellerContext());if(sale){recordCravingSale(sale.npc,sale.t,sale.qty);save();toast('Sales assistant · '+cash(sale.pay)+' · '+STRAINS[sale.t].name+' · '+CONTACTS[sale.npc].name);}cravingAskTimer+=dt;if(cravingAskTimer>=15){cravingAskTimer=0;postCravingAsks();}};
const update19=update;update=function(dt){update19(dt);
 const remote=net.remote?.worker,isGuest=net.role==='guest';
 crafterActor.visible=!!(active&&s.room&&s.helpers.crafter&&s.staffConfig.crafter.stock==='stored'&&(!isGuest||(net.connected&&performance.now()-(net.workerSeenAt||0)<5000&&workerPoseValid(remote,WORLD)&&remote.visible)));
 if(crafterActor.visible){const p=isGuest?remote:physicalCrafter.position,dx=p.x-crafterActor.position.x,dz=p.z-crafterActor.position.z;
  if(isGuest){const blend=Math.hypot(dx,dz)>8?1:1-Math.exp(-dt*10);crafterActor.position.x+=dx*blend;crafterActor.position.z+=dz*blend;crafterActor.rotation.y=turnTowards(crafterActor.rotation.y,p.angle,dt);}
  else{if(Math.hypot(dx,dz)>.001)crafterActor.rotation.y=turnTowards(crafterActor.rotation.y,Math.atan2(dx,dz),dt);crafterActor.position.set(p.x,0,p.z);}
  cargoBox.visible=isGuest?!!remote.carrying:!!s.crafterCargo;crafterActor.userData.carrying=cargoBox.visible;
 }
 gardenerActor.visible=!!(active&&!isGuest&&s.room&&s.helpers.gardener&&s.staffConfig.gardener.route==='walk'&&physicalGardener.home===s.house);
 if(gardenerActor.visible)placeFieldActor(gardenerActor,physicalGardener.position,dt);
 sellerActor.visible=!!(active&&!isGuest&&s.helpers.seller&&s.staffConfig.seller.route==='walk'&&physicalSeller.position);
 if(sellerActor.visible)placeFieldActor(sellerActor,physicalSeller.position,dt);
};
const resetFieldCrew=resetSystems;resetSystems=function(){resetFieldCrew();physicalGardener.home=-1;physicalGardener.path=null;physicalGardener.work=0;physicalGardener.jobKey='';physicalSeller.home=-1;physicalSeller.position=null;physicalSeller.work=0;physicalSeller.targetNpc=-1;};

const balanceFeedback=createBalanceFeedback();
const businessHUD=document.createElement('div');businessHUD.id='businessHUD';businessHUD.setAttribute('aria-label','Business stock');document.body.appendChild(businessHUD);
const receipt=document.createElement('div');receipt.id='moneyReceipt';receipt.setAttribute('role','status');receipt.setAttribute('aria-live','polite');document.body.appendChild(receipt);
let receiptUntil=0,businessKey='';
function updateBusinessHUD(){
 businessHUD.hidden=!active||!!panel;receipt.hidden=!active||performance.now()>receiptUntil;
 if(!active){balanceFeedback.reset();return;}
 const q=stockSummary(s),key=JSON.stringify(q);
 if(key!==businessKey){businessKey=key;businessHUD.innerHTML='<button onclick="menu(\'bag\')" aria-label="Open inventory"><span>SUPPLIES <b>'+q.raw+'</b></span><span>LOOSE <b>'+q.loose+'</b></span><span>WRAPPERS <b>'+q.wrappers+'</b></span><span>PACKS <b>'+q.carried+'</b></span></button><small>'+q.available+' available · '+q.reserved+' promised · '+q.stored+' stored'+(q.transit?' · 1 worker batch in transit':'')+'</small>';}
 const changes=balanceFeedback.sample(s.cash,s.bank);
 if(changes.length){receipt.textContent=changes.map(c=>(c.account==='cash'?'Wallet ':'Card ')+(c.amount>0?'+':'−')+cash(Math.abs(c.amount))).join('  ·  ');receipt.dataset.positive=String(changes.reduce((v,c)=>v+c.amount,0)>=0);receiptUntil=performance.now()+2800;receipt.hidden=false;}
 paintHotbarSelection();
}

// V22: equipped stock and everyday customer presentation, independent of transactions.
let equippedTool=null,equippedStrain=0;
const carriedPack=new THREE.Group();camera.add(carriedPack);
const packBody=rounded(.36,-.31,-.65,.25,.34,.09,0xd0bc88,carriedPack);
const packLabel=box(.36,-.3,-.596,.19,.19,.012,0x93c35b,false,carriedPack);
box(.36,-.15,-.65,.27,.025,.1,0xeee0ba,false,carriedPack);
carriedPack.visible=false;
function equipTool(tool){
 if(!active||stationTask||driving||placeMode)return;
 if(tool==='can'&&!s.can){toast('Buy a watering can at Hank’s hardware.');return;}
 if(tool==='packs'&&!s.packs.some(n=>n>0)){toast('Pack a gummy at your worktable first.');return;}
 equippedTool=equippedTool===tool?null:tool;
 if(equippedTool==='packs')equippedStrain=s.packs.findIndex(n=>n>0);
 if(panel)close();updateBusinessHUD();
}
window.equipTool=equipTool;
function cycleCarriedPack(){if(equippedTool!=='packs')return;for(let n=1;n<=s.packs.length;n++){const i=(equippedStrain+n)%s.packs.length;if(s.packs[i]>0){equippedStrain=i;toast(STRAINS[i].name+' · '+s.packs[i]+' carried');break;}}}
window.cycleCarriedPack=cycleCarriedPack;
const toolbar=document.querySelector('.hotbar');
if(toolbar){toolbar.innerHTML=hotbarHTML(esc);toolbar.querySelectorAll('.slot').forEach(b=>b.addEventListener('click',()=>useHotbarSlot(b.querySelector('i')?.textContent)));toolbar.querySelector('#cashSlot')?.addEventListener('click',()=>menu('bag'));toolbar.querySelector('#cardSlot')?.addEventListener('click',()=>menu('wallet'));}
addEventListener('keydown',e=>{
 if(!active||e.repeat||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||stationTask||placeMode)return;
 if(!panel&&e.key.toLowerCase()==='q')cycleCarriedPack();

});
const equipmentHUD=updateBusinessHUD;updateBusinessHUD=function(){equipmentHUD();
 for(const [id,tool,label] of [['equipCan','can','Can'],['equipPacks','packs','Packs']]){const b=$(id);if(!b)continue;const selected=equippedTool===tool;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));b.setAttribute('aria-label',label+(selected?' equipped':' — equip'));}
};
const equipmentReset=resetSystems;resetSystems=function(){equipmentReset();clearExchangeGesture();equippedTool=null;carriedPack.visible=false;watering.visible=false;};
const equipmentRender=renderFrame;renderFrame=function(){
 if(equippedTool==='packs'&&!(s.packs[equippedStrain]>0)){equippedStrain=s.packs.findIndex(n=>n>0);if(equippedStrain<0)equippedTool=null;}
 if(equippedTool==='can'&&!s.can)equippedTool=null;
 const view=firstPersonVisibility({active,panel,station:!!stationTask,driving,placing:!!placeMode,work,equipped:equippedTool}),visible=view.hand;
 hand.visible=view.hand;carriedPack.visible=view.pack;
 const cycle=document.getElementById('cyclePack');if(cycle){cycle.hidden=!visible||equippedTool!=='packs';if(!cycle.hidden)cycle.textContent=STRAINS[equippedStrain].name+' · '+s.packs[equippedStrain]+' / Next flavour';}
 if(carriedPack.visible){packLabel.material=mat(STRAINS[equippedStrain].color);carriedPack.position.y=hand.position.y;}
 watering.visible=view.can;
 refreshExchangeGesture();
 equipmentRender();
};
// A committed handoff is a short presentation event, not extra carried stock.
// Reuse the existing first-person hand/pack and the recipient's original Talk clip.
let exchangeGesture=null;
function restoreExchangeTransforms(){
 hand.position.x=hand.position.z=hand.rotation.x=0;
 carriedPack.position.x=carriedPack.position.z=carriedPack.rotation.x=0;carriedPack.scale.setScalar(1);
}
function clearExchangeGesture(){exchangeGesture=null;restoreExchangeTransforms();carriedPack.visible=false;}
function committedExchange(kind,npc,t,qty){
 const receipt=readExchangeReceipt({kind,npc,t,qty},STRAINS.length);if(!receipt)return;
 if(processingRemote){committedRemoteExchange=receipt;return;}
 startExchangeGesture(receipt);
}
function startExchangeGesture(value){
 const receipt=readExchangeReceipt(value,STRAINS.length);
 if(!receipt||!active||document.hidden||driving||placeMode||stationTask||work||s.police?.search||!customerExchangeStatus(receipt.npc).ok||panel&&!(panel==='customer'&&selected===receipt.npc))return false;
 if(panel)close();restoreExchangeTransforms();exchangeGesture={...receipt,started:performance.now()};return true;
}
function exchangeGestureTargets(g){
 return !!(exchangeGesture&&g===people[exchangeGesture.npc]&&active&&!panel&&!document.hidden&&!driving&&!stationTask&&!s.police?.search&&performance.now()-exchangeGesture.started<EXCHANGE_GESTURE_MS&&customerExchangeStatus(exchangeGesture.npc).ok);
}
function refreshExchangeGesture(){
 restoreExchangeTransforms();if(!exchangeGesture)return;
 if(!active||document.hidden||panel||driving||placeMode||stationTask||work||s.police?.search||!customerExchangeStatus(exchangeGesture.npc).ok){clearExchangeGesture();return;}
 const pose=exchangeGesturePose(performance.now()-exchangeGesture.started);if(!pose){exchangeGesture=null;return;}
 watering.visible=false;hand.visible=true;hand.position.x=-.04*pose.reach;hand.position.z=-.12*pose.reach;hand.rotation.x=-.12*pose.reach;
 carriedPack.visible=pose.packVisible;carriedPack.position.set(-.04*pose.reach,hand.position.y+.05*pose.reach,-.32*pose.reach);carriedPack.rotation.x=.1*pose.reach;carriedPack.scale.setScalar(pose.packScale);
 packLabel.material=mat(STRAINS[exchangeGesture.t].color);
}
addEventListener('blur',clearExchangeGesture);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearExchangeGesture();});
// Personal idle props follow the active animated hand, including LOD switches.
const residentProps=new Map();
for(const [i,g] of people.entries()){
 const phone=new THREE.Group(),cup=new THREE.Group();phone.userData.gameplayAttachment=cup.userData.gameplayAttachment=true;g.add(phone,cup);
 box(0,0,0,.11,.19,.025,0x344750,false,phone);box(0,0,.016,.085,.145,.008,0xa5c6b0,false,phone);
 cyl(0,0,0,.053,.13,0xc8ac7c,cup);cyl(0,.072,0,.058,.014,0xefe3c6,cup);
 phone.visible=cup.visible=false;residentProps.set(g,{phone,cup,index:i});
}
const residentAnimation=actorAnimation;actorAnimation=function(a,dt){residentAnimation(a,dt);
 const props=residentProps.get(a.g);if(!props)return;
 const handBone=a.body.getObjectByName('Hand1');
 if(handBone&&props.phone.parent!==handBone){handBone.add(props.phone,props.cup);props.phone.position.set(0,.035,.025);props.phone.rotation.set(Math.PI/2,0,0);props.cup.position.set(0,.015,.055);props.cup.rotation.set(Math.PI/2,0,0);}
 const plan=planForResident(props.index),arrived=Math.hypot(a.g.position.x-plan.x,a.g.position.z-plan.z)<.7;
 const conversing=addressedActor(a.g)||exchangeGestureTargets(a.g);
 const resting=!!handBone&&active&&arrived&&!a.g.userData.walking&&a.speed<.08&&!conversing&&!plan.meeting;
 props.phone.visible=resting&&plan.activity==='phone';props.cup.visible=resting&&plan.activity==='drink';
 if(props.phone.visible||props.cup.visible){const arm=a.body.getObjectByName('UpperArm1'),fore=a.body.getObjectByName('Forearm1');if(arm)arm.rotation.x=-.35;if(fore)fore.rotation.x=-1.15;}
};
const residentMenu=menu;menu=function(which,data){residentMenu(which,data);
 if(which==='customer'){const i=Number.isInteger(data)?data:selected;if(CONTACTS[i])$('modal').insertAdjacentHTML('afterbegin','<p class="resident-line">'+esc(planForResident(i).line)+'</p><p class="note">'+esc(residentStatus(i))+'</p>');}
 if(which==='bag')$('modal').innerHTML+='<h3>Carry something</h3><p>7 equips your watering can. 8 equips a pack from your real inventory; Q cycles flavours. Press the same slot again to lower it. Use E at plants, sinks and customers for their normal actions.</p><button class="ghost" onclick="equipTool(\'can\')">Equip can</button> <button class="ghost" onclick="equipTool(\'packs\')">Equip pack</button>';
};window.menu=menu;
const cyclePack=document.createElement('button');cyclePack.id='cyclePack';cyclePack.hidden=true;cyclePack.setAttribute('onclick','cycleCarriedPack()');cyclePack.setAttribute('aria-label','Cycle carried gummy flavour');document.body.appendChild(cyclePack);
// V25: distinct production gestures and an equipment-dependent sealing action.
function isTimedSeal(){return !!(stationTask?.k==='pack'&&stationTask.step===1&&s.bench>0);}
function pressSeal(){
 if(!isTimedSeal())return;
 if(!sealReady(stationTask.elapsed)){toast('Outside the seal window. Try again — no supplies lost.');playTone(160,.08,.015);return;}
 advanceStation(.9*Math.sqrt(stationTask.batch?.count||1));
}
const tactilePaint=paintStation;paintStation=function(){tactilePaint();if(!stationTask)return;
 const tip=taskInstruction(stationTask.k,stationTask.step);
 if(tip)$('stationHUD').insertAdjacentHTML('beforeend','<p class="tactile-tip">'+tip+'</p>');
 if(isTimedSeal()){$('stationHUD').innerHTML='<div class="overline">UPGRADED PRESS / SEAL</div><h2>Press in the green zone</h2><p>Click the work surface, tap the button or press Space when the marker crosses the middle.</p><div class="seal-meter" aria-label="Sealing timing meter"><span class="seal-zone"></span><i id="sealCursor"></i></div><button id="stationAssist" class="primary">Seal now / Space</button><button onclick="assistSeal()">Use steady seal instead</button><p>Batch of '+(stationTask.batch?.count||1)+' · Misses cost no stock.</p><button onclick="cancelStation()">Cancel [Esc]</button>';}
};
// An accessible equivalent keeps the upgrade usable without a timing requirement.
function assistSeal(){if(!isTimedSeal())return;stationTask.steadySeal=true;paintStation();}
window.assistSeal=assistSeal;
const timedSealCheck=isTimedSeal;isTimedSeal=function(){return timedSealCheck()&&!stationTask.steadySeal;};
const tactileMenu=menu;menu=function(which,data){tactileMenu(which,data);
 if(which==='hardware'||which==='craft')$('modal').innerHTML+='<p class="note">The press upgrade unlocks batches of four and a timed seal. Prefer a steady action? Choose “Use steady seal instead” at the sealer.</p>';
};window.menu=menu;

// One shared, depth-tested label follows only the nearby usable station.
// Repaint on text changes rather than allocating textures every frame.
const readinessCanvas=document.createElement('canvas');readinessCanvas.width=768;readinessCanvas.height=128;
const readinessTexture=new THREE.CanvasTexture(readinessCanvas);readinessTexture.colorSpace=THREE.SRGBColorSpace;
const readinessLabel=new THREE.Sprite(new THREE.SpriteMaterial({map:readinessTexture,depthTest:true,depthWrite:false,transparent:true,toneMapped:false}));
readinessLabel.scale.set(3.2,3.2/6,1);readinessLabel.visible=false;scene.add(readinessLabel);
let readinessKey='';
const readinessUI=updateUI;updateUI=function(){
 readinessUI();refreshCrewPanel();refreshCustomerPanel();refreshApproachPanel();const info=near&&(near.type==='staffboard'?{text:s.helpers.crafter?'Gummy maker · '+workerStatus('crafter'):'Workshop roster · assignments and status',ready:true}:stationReadiness(near.type,s));
 readinessLabel.visible=!!(active&&!panel&&!work&&!stationTask&&info);
 if(!readinessLabel.visible)return;
 readinessLabel.position.set(near.x,2.25,near.z);
 const key=info.text+info.ready;if(key!==readinessKey){
  readinessKey=key;const c=readinessCanvas.getContext('2d');c.clearRect(0,0,768,128);c.fillStyle='#192d29';c.fillRect(0,0,768,128);
  c.fillStyle=info.ready?'#b9d99a':'#ebbf88';c.fillRect(0,0,8,128);
  readinessLabel.userData.signLayout=drawSignText(c,info.text,{x:24,y:12,width:720,height:104},{maxFont:36,minFont:22,weight:500});readinessTexture.needsUpdate=true;
 }
 const small=$('prompt').querySelector?.('small');if(small)small.textContent=info.text;
};
const readinessRender=renderFrame;renderFrame=function(){if(!active||panel||work||stationTask)readinessLabel.visible=false;readinessRender();};

// One physical-approach policy for local requests, task commits and host commands.
function currentInteractionActor(){return processingRemote?{x:player.x,z:player.z,y:Number.isFinite(net.remote?.y)?net.remote.y:1.72+floorHeight(player.x,player.z)}:player;}
function physicalActionAccess(k,a,actor=currentInteractionActor(),inVehicle=processingRemote?net.remote?.vehicle:driving){
 const types=actionPointTypes(k,a);if(types===null)return null;
 if(net.role==='guest'&&!net.connected)return {ok:false,reason:'Reconnect to the host before using this shop or workstation.'};
 if(inVehicle)return {ok:false,reason:'Leave the van before using shops or workstations.'};
 const point=points.find(p=>actionPointMatches(p,k,a)&&pointVisible(p)&&pointApproach(actor,p,blocked,floorHeight));
 return point?{ok:true,point,reason:'Within reach · '+point.label}:{ok:false,reason:'Walk to a clear approach at the correct shop or workstation. Nothing was consumed.'};
}
const approachMenus={payphone:'call',reception:'rent',hardware:'buyCan',dealer:'soil',store:'wrappers',servo:'ingredient',property:'house',house:'house',workshop:'house',laundry:'deposit',bed:'sleep',atm:'atmDeposit',recycler:'recycle',garage:'buyVehicle',helpers:'worker',staffboard:'worker',stockroom:'stash',craft:'make',sink:'fill',mix:'mix',tent:'prepare'};
function refreshApproachPanel(){const k=approachMenus[panel];if(!k)return;const note=document.getElementById('approachStatus'),status=physicalActionAccess(k,selected);if(note&&status){note.textContent=status.reason;note.classList?.toggle('out-of-reach',!status.ok);}gateReachButtons();}
// Play-test fix: out-of-reach action buttons used to stay clickable and only toast on click.
// Each action button is checked against its own reach rule and greyed out until you are close enough.
let reachGateAt=-1;
function gateReachButtons(force=false){
 const t=performance.now();if(!force&&t-reachGateAt<200)return;reachGateAt=t;
 const modal=$('modal');if(typeof modal?.querySelectorAll!=='function')return;
 gateButtons(modal.querySelectorAll('button'),physicalActionAccess,selected);
}
const approachMenu=menu;menu=function(which,data){approachMenu(which,data);const k=approachMenus[which];if(k){const status=physicalActionAccess(k,selected);$('modal').innerHTML='<p id="approachStatus" class="note'+(status.ok?'':' out-of-reach')+'" role="status">'+esc(status.reason)+'</p>'+$('modal').innerHTML;gateReachButtons(true);}};window.menu=menu;
const approachAction=action;action=function(k,a,b,c){const status=physicalActionAccess(k,a);if(status&&!status.ok){toast(status.reason);return;}approachAction(k,a,b,c);};window.action=action;
const approachCommit=doAction;doAction=function(k,a,b,c){const status=physicalActionAccess(k,a);if(status&&!status.ok){if(!processingRemote)toast(status.reason);return;}approachCommit(k,a,b,c);};

function policeReportHTML(){const report=readPoliceReport(ensurePolice().report);return report?'<section class="staffcard"><h3>Last search outcome</h3><p>'+(report.day?'Day '+report.day+' · ':'')+(report.role==='host'?'Host':'Partner')+' search · '+report.seized+' carried gummy products seized · '+cash(report.fine)+' fine.</p><p>Stored packs, seeds, equipment, in-transit worker stock and bank funds were not seized. Shared carried inventory is affected whichever player was searched.</p></section>':'';}
const policeOutcomeMenu=menu;menu=function(which,data){policeOutcomeMenu(which,data);if(which==='journal')$('modal').innerHTML+='<p class="note">H can safely leave a work task or menu to comply with a visible nearby officer, except while typing. A search pauses shared business work and keeps reserved worker cargo intact. Its host-owned countdown continues through host menus while the game is open. Reload resumes an unfinished search; the latest result stays in this notebook.</p>';if(['journal','pause'].includes(which))$('modal').innerHTML+=policeReportHTML();};window.menu=menu;
const searchSafeAction=action;action=function(k,a,b,c){if(ensurePolice().search){toast('Police search in progress. Shared business actions resume when the search finishes.');return;}searchSafeAction(k,a,b,c);};window.action=action;

function trackWorkshop(destination){
 const h=HOMES[s.house],type={work:'craft',storage:'stockroom',crew:'staffboard',supplies:'staffboard'}[destination];
 const point=destination==='entrance'?{x:h.x,z:h.z+h.d/2-1,label:WORKSHOP_NAMES[s.house]+' entrance'}:type?points.find(p=>p.type===type&&pointVisible(p)):null;
 if(!s.room||!point)return;track={x:point.x,z:point.z,label:point.label,type:destination==='entrance'?'workshopEntrance':type};close();toast('Tracking '+point.label);
}window.trackWorkshop=trackWorkshop;
function presentWorkshopRelocation(from){
 if(from===s.house)return;if(stationTask)cancelStation();cancelPlacement();work=null;stationHeld=stationAssist=false;$('work').style.display='none';
 if(['craft','sink','mix','staffboard','stockroom','tent','station'].includes(panel))close();
 refreshBase();const types=['tent','craft','sink','mix','stockroom','staffboard'];
 if(track&&types.includes(track.type)){const point=points.find(p=>p.type===track.type&&pointVisible(p)&&(track.type!=='tent'||!Number.isInteger(track.tentIndex)||p.i===track.tentIndex));if(point)Object.assign(track,{x:point.x,z:point.z,label:point.label});}
 else if(!track||track.type==='workshopEntrance'){const h=HOMES[s.house];track={x:h.x,z:h.z+h.d/2-1,label:WORKSHOP_NAMES[s.house]+' entrance',type:'workshopEntrance'};}
}
function handleWorkshopRelocation(from){
 refreshBase();Object.assign(physicalCrafter,{home:s.house,position:{...workerContext().source},path:null,target:'',progress:0,retry:0,status:s.workerEnabled.crafter?'Walking to supplies':'Assignment paused'});
 crafterActor.position.set(physicalCrafter.position.x,0,physicalCrafter.position.z);crafterActor.userData.carrying=false;cargoBox.visible=false;
 Object.assign(physicalGardener,{home:s.house,position:{...workerContext().source},path:null,work:0,jobKey:'',retry:0});gardenerActor.position.set(physicalGardener.position.x,0,physicalGardener.position.z);physicalSeller.home=-1;physicalSeller.position=null;physicalSeller.work=0;physicalSeller.targetNpc=-1;
 if(!processingRemote)presentWorkshopRelocation(from);
}
function workshopGuideHTML(){
 if(!s.room)return '';const moved=readWorkshopMove(s.lastMove,s.house),installed=(s.installed||[]).filter(i=>i<maxTents()).length;
 return '<section class="staffcard"><h3>Your workshop · '+WORKSHOP_NAMES[s.house]+'</h3><p>'+installed+' installed / '+maxTents()+' tent spaces · '+storedUsed()+' / '+storageCapacity()+' stored packs · '+stockUsed()+' / '+stockCapacity()+' total goods.</p>'+(moved?'<p>Moved from '+moved.from+' on day '+moved.day+'. Crops and orders retained.'+(moved.cargo==='input'?' The worker’s reserved input and wrapper were returned.':moved.cargo==='output'?' The worker’s finished pack was returned to your bag.':'')+'</p>':'')+'<p>Your production is here; your player position and customer meetings do not teleport.</p><div class="order-actions"><button onclick="trackWorkshop(\'entrance\')">Find entrance</button><button onclick="trackWorkshop(\'supplies\')">Supplies / crew</button><button onclick="trackWorkshop(\'work\')">Worktable</button><button onclick="trackWorkshop(\'storage\')">Stockroom</button></div></section>';
}
const workshopGuideMenu=menu;menu=function(which,data){workshopGuideMenu(which,data);if(['property','house','workshop','journal','map'].includes(which))$('modal').innerHTML+=workshopGuideHTML();};window.menu=menu;
const workshopTrack=trackPlace;trackPlace=function(type){workshopTrack(type);if(track)track.type=type;};window.trackPlace=trackPlace;
const workshopWire=wireChannel;wireChannel=function(ch){workshopWire(ch);const receive=ch.onmessage;ch.onmessage=e=>{const before=s.house;receive(e);if(active&&before!==s.house)presentWorkshopRelocation(before);};};

// Purchased tent frames need assembly, not an already-installed tent model.
// Eight fixed canvas labels use original lettering; no model/rig edits or stock.
const assemblyPoints=Array.from({length:8},(_,i)=>points.find(p=>p.type==='tent'&&p.i===i));
const assemblyLabels=Array.from({length:8},(_,i)=>{
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d'),words=assemblyWording(i);
 ctx.fillStyle='#254f55';ctx.fillRect(0,0,512,128);ctx.fillStyle='#fff1ca';
 const heading=drawSignText(ctx,words.heading,{x:18,y:10,width:476,height:54},{maxFont:30,minFont:18,maxLines:1,weight:800});
 const detail=drawSignText(ctx,words.detail,{x:18,y:75,width:476,height:40},{maxFont:23,minFont:16,maxLines:1,weight:500});
 const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;
 const label=new THREE.Sprite(new THREE.SpriteMaterial({map,depthTest:true,depthWrite:false,transparent:true,toneMapped:false}));
 label.scale.set(2.3,.575,1);label.userData={assemblyIndex:i,heading,detail};label.visible=false;scene.add(label);return label;
});
function setAssemblyTrack(guide){
 const point=guide.next===null?null:assemblyPoints[guide.next];
 if(!point)return false;const label='Set up tent '+(point.i+1)+' · '+WORKSHOP_NAMES[s.house];
 if(track?.purpose==='assembly'){track.x=point.x;track.z=point.z;track.label=label;track.tentIndex=point.i;}
 else track={x:point.x,z:point.z,label,type:'tent',tentIndex:point.i,purpose:'assembly'};return true;
}
function trackAssembly(){
 if(!active)return;refreshBase();const guide=workshopEquipment(s);
 if(!guide.room||!setAssemblyTrack(guide)){toast(guide.room?'All owned tents are installed.':'Rent a workshop before setting up a tent.');return;}
 close();toast('Tracking '+track.label);
}window.trackAssembly=trackAssembly;
let equipmentHome=-1,equipmentLayout=null,equipmentGuideKey='',equipmentGuideView=null;
function refreshEquipmentPresentation(){
 // Runs on UI and render paths, including title/fresh-slot/snapshot transitions.
 if(equipmentHome!==s.house||equipmentLayout!==s.layout){refreshBase();equipmentHome=s.house;equipmentLayout=s.layout;}
 const key=[s.house,s.room,s.tents,(s.installed||[]).join(',')].join('|');
 if(key!==equipmentGuideKey){equipmentGuideKey=key;equipmentGuideView=workshopEquipment(s);}
 const guide=equipmentGuideView,visible=!!(active&&guide.room);
 tents.forEach((g,i)=>g.visible=visible&&guide.slots[i].installed);
 mixers.forEach((g,i)=>g.visible=visible&&!!s.mixer&&i===guide.home);
 for(const d of workshopDisplays){const show=visible&&d.home===guide.home;d.group.visible=show;if(d.supply)d.supply.visible=show;d.labels.forEach(l=>l.visible=show);}
 for(const [i,label] of assemblyLabels.entries()){
  const point=assemblyPoints[i];
  label.visible=!!(visible&&guide.slots[i].pending&&point&&!panel&&!work&&!stationTask&&!placeMode&&Math.hypot(player.x-point.x,player.z-point.z)<22);
  if(point)label.position.set(point.x,1.05,point.z);
 }
 if(track?.purpose==='assembly'){
  if(!visible||!setAssemblyTrack(guide))track=null;
 }
 beacon.visible=!!(active&&track);if(track)beacon.position.set(track.x,0,track.z);
 refreshEquipmentPanel(guide);
}
function equipmentGuideContent(guide){
 if(!guide.room)return '';
 return '<h3>Equipment · '+WORKSHOP_NAMES[s.house]+'</h3><p>'+guide.owned+' tents owned · '+guide.installed+' installed · '+guide.pending+' awaiting assembly.</p><p>'+(guide.pending?'The numbered teal labels mark your owned frames waiting to be set up. Approach the label and press E; installation does not buy another tent.':guide.owned?'Every owned tent is installed. Buy another only if you want another growing space.':'No tent owned yet. Buy one reusable frame from Hank’s, then assemble it at your workshop.')+'</p><p>Can: '+(s.can?s.water+' / 6 charges':'not owned')+' · Trimmers: '+(s.trimmers?'owned':'not owned')+' · Packaging station: '+(s.packStation?'installed at the worktable':'not purchased')+'.</p>'+(guide.pending?'<button class="primary" onclick="trackAssembly()">Find tent '+(guide.next+1)+' assembly spot</button>':'');
}
function equipmentGuideHTML(){const guide=workshopEquipment(s);return '<section id="equipmentGuide" class="staffcard"'+(guide.room?'':' hidden')+'>'+equipmentGuideContent(guide)+'</section>';}
function refreshEquipmentPanel(guide){
 if(!['hardware','bag','journal'].includes(panel))return;const target=document.getElementById('equipmentGuide');if(!target)return;
 const key=[equipmentGuideKey,s.can,s.water,s.trimmers,s.packStation].join('|');
 if(target.dataset.equipmentKey===key)return;target.dataset.equipmentKey=key;target.hidden=!guide.room;target.innerHTML=equipmentGuideContent(guide);
}
const equipmentGuideMenu=menu;menu=function(which,data){equipmentGuideMenu(which,data);if(['hardware','bag','journal'].includes(which))$('modal').innerHTML+=equipmentGuideHTML();};window.menu=menu;
const equipmentGuideUI=updateUI;updateUI=function(){equipmentGuideUI();refreshEquipmentPresentation();};
const equipmentGuideRender=renderFrame;renderFrame=function(){refreshEquipmentPresentation();equipmentGuideRender();};

// One read-only lighting projection covers local play, menus, reload and host snapshots.
// Reuse the original two practical lights; do not add lights, meshes or rig edits.
const lightingAnchors=[...indoorAnchors.filter(a=>!HOMES.some(h=>h.x===a.x&&h.z===a.z)),...HOMES.flatMap((h,home)=>[
 {id:'work:'+home,x:h.x+7,y:2.65,z:h.z+3,home},
 {id:'supplies:'+home,x:h.x+4.5,y:2.3,z:h.z+3.4,home},
 {id:'stock:'+home,x:h.x-1.8,y:2.8,z:h.z+4,home}
])];
const lightingColors={night:new THREE.Color(0x293943),day:new THREE.Color(0xb9cfdb),sunDay:new THREE.Color(0xfff1de),sunDusk:new THREE.Color(0xffc58c),skyNight:new THREE.Color(0x314555),skyDay:new THREE.Color(0x6299be)};
const policeSignalRed=new THREE.Color(0xef4c48),policeSignalBlue=new THREE.Color(0x4b83ff),policeSignalColor=new THREE.Color();
function refreshPoliceLighting(night){
 const plan=policeLighting(s.police,camera.position,{active,connected:net.role!=='guest'||net.connected,stale:net.role==='guest'&&performance.now()-(net.workerSeenAt||0)>5000,quality,night,now,sight:copSight});
 for(const g of officers)for(const material of g.userData.warningMaterials)material.emissiveIntensity=0;
 for(const signal of plan.signals){
  policeSignalColor.copy(policeSignalRed).lerp(policeSignalBlue,signal.blend);
  for(const material of officers[signal.index].userData.warningMaterials){material.emissive.copy(policeSignalColor);material.emissiveIntensity=1.1;}
 }
 if(plan.target)policeSignalColor.copy(policeSignalRed).lerp(policeSignalBlue,plan.target.blend);
 return plan.target;
}
// Exact room identity, captured when the existing geometry was created; never tint
// the shared exported upper-storey/district/RV glass or infer occupancy from colour.
const windowRoomIdentity=row=>{const home=HOMES.findIndex(h=>h.x===row.x&&h.z===row.z);return {...row,home:home<0?null:home};};
const occupiedWindowRows=facadeWindows.map(windowRoomIdentity),occupiedFittingRows=interiorFittings.map(windowRoomIdentity);
function refreshWindowLighting(night){
 const age=performance.now()-net.workerSeenAt,available=net.role!=='guest'||net.connected&&Number.isFinite(net.workerSeenAt)&&age>=0&&age<=5000;
 for(const row of occupiedWindowRows){
  const plan=occupiedWindowLighting(row.home,s,{active,available,night,side:row.side});
  row.mesh.material.emissive.set(0xffc486);row.mesh.material.emissiveIntensity=plan.windowEmission;
 }
 for(const row of occupiedFittingRows)row.mesh.material.emissiveIntensity=occupiedWindowLighting(row.home,s,{active,available,night}).fittingEmission;
}
const coastalMistColor=new THREE.Color(0x9aaba9),coastalCloudColor=new THREE.Color(0x829695);
function refreshWorldLighting(){
 const plan=sceneLighting(s.time,active);
 const atmosphere=atmosphericDistancePlan({daylight:plan.daylight,active:active||cine.lit,quality});scene.fog.near=atmosphere.near;scene.fog.far=atmosphere.far;waterUniforms.uFogNear.value=atmosphere.waterNear;waterUniforms.uFogFar.value=atmosphere.waterFar;
 sun.intensity=plan.sunIntensity;sun.color.setHex(plan.sunColor);
 hemi.intensity=plan.hemisphereIntensity;hemi.color.setHex(plan.hemiSky);hemi.groundColor.setHex(plan.hemiGround);renderer.toneMappingExposure=plan.exposure;
 if(active||cine.lit){scene.background.setHex(plan.fogColor);scene.fog.color.copy(scene.background);}
 else{scene.background.set(0x172523);scene.fog.color.set(0x26352f);}
 lights.forEach(l=>{l.intensity=plan.streetIntensity;l.color.setHex(0xffb35a);});porchBulbs.forEach(b=>{b.material.emissiveIntensity=plan.porchEmission;if(plan.night>.2)b.material.emissive.setHex(0xffb35a);});
 skyUniforms.night.value=plan.skyBrightness;skyUniforms.bottom.value.copy(scene.fog.color);skyUniforms.top.value.setHex(plan.hemiSky);
 effects?.setGrade?.(plan.night,plan.warmth,plan.bloom);
 waterUniforms.uLight.value=plan.waterBrightness;waterUniforms.uFog.value.copy(scene.fog.color);
 refreshWindowLighting(plan.night);
 const weather=gbSky();
 if(active){sun.intensity*=(1-weather.cloud*.42)*(1-(weather.rain||0)*.3);hemi.intensity*=1-weather.cloud*.12;
 scene.fog.near*=1-weather.mist*.5;scene.fog.far*=1-weather.mist*.32;
 scene.fog.color.lerp(coastalMistColor,weather.mist*.18*plan.daylight);
 skyUniforms.top.value.lerp(coastalCloudColor,weather.cloud*.32*plan.daylight);
 skyUniforms.bottom.value.copy(scene.fog.color);waterUniforms.uFog.value.copy(scene.fog.color);
 waterUniforms.uFogNear.value=atmosphere.waterNear*(1-weather.mist*.5);waterUniforms.uFogFar.value=atmosphere.waterFar*(1-weather.mist*.32);
 }
 // Cinematic grade: a clearer blue zenith, brighter low sun and a touch more exposure.
 // Only while a cinematic owns the clock; gameplay lighting is untouched.
 if(cine.lit&&cine.grade){sun.intensity*=1.5;hemi.intensity*=1.08;renderer.toneMappingExposure=plan.exposure*1.07;skyUniforms.night.value=Math.max(skyUniforms.night.value,1.02);skyUniforms.top.value.lerp(cineZenith,.72);}
 const warning=refreshPoliceLighting(plan.night);
 const targets=selectPracticalLights(camera.position,lightingAnchors,{active,room:s.room,house:s.house,quality});
 const practicalCount=warning?1:2,practicalTotal=targets.slice(0,practicalCount).reduce((n,t)=>n+t.intensity,0),available=18-(warning?.intensity??0),scale=practicalTotal>available?available/practicalTotal:1;
 interiorLights.forEach((l,i)=>{
  const response=warning&&i===1,target=response?warning:targets[i];
  l.intensity=target?(response?target.intensity:target.intensity*scale):0;l.userData.anchorId=response?'police:'+warning.index:target?.id??null;l.userData.home=response?null:target?.home??null;l.userData.policeIndex=response?warning.index:null;
  l.distance=response?8:i===0?11:10;l.color.set(response?0xffffff:i===0?0xffd6a0:0xe9dabb);if(response)l.color.copy(policeSignalColor);
  if(target)l.position.set(target.x,target.y,target.z);
 });
}
const skyClouds=createSkyClouds(scene);
const worldLightingRender=renderFrame;renderFrame=function(){refreshWorldLighting();const cloudLight=sceneLighting(s.time,active);skyClouds.update(camera,{time:now,daylight:cloudLight.daylight,warmth:cloudLight.warmth,sunColor:cloudLight.sunColor,cloud:active&&!cine.lit?gbSky().cloud:.15});worldLightingRender();};


 // Layout/installation changes may surround either player. Local-only unembedding
 // is presentation/movement safety, never an inventory commit or guest slot write.
const tentGeometryAction=doAction;doAction=function(k,...args){
 const relevant=['install','placeTent','house'].includes(k),before=relevant?JSON.stringify([s.house,s.room,s.tents,s.installed,s.layout]):null;
 tentGeometryAction(k,...args);
 if(relevant&&!processingRemote&&before!==JSON.stringify([s.house,s.room,s.tents,s.installed,s.layout])){recoverTentPlayer();syncPlayerView();}
};
const tentGeometryWire=wireChannel;wireChannel=function(ch){
 tentGeometryWire(ch);const receive=ch.onmessage;
 ch.onmessage=e=>{const before=s;receive(e);if(net.ch===ch&&net.role==='guest'&&active&&s!==before){recoverTentPlayer();syncPlayerView();}};
};

// A visit is physical and host-authoritative. Ten game minutes separate
// distinct visits so repeatedly opening a shop cannot inflate the memory.
const locationVisitAction=doAction;doAction=function(k,a,...args){
 if(k!=='visitPlace')return locationVisitAction(k,a,...args);
 if(!locationVisitAccess(a,currentInteractionActor(),processingRemote?net.remote?.vehicle:driving))return;
 recordLocationVisit(s.visits,a,s.day,s.time);
};
function locationMemoryHTML(key){const memory=locationMemoryCopy(s.visits,key);return memory?'<section class="staffcard location-memory"><h3>'+esc(memory.title)+' · '+memory.detail+'</h3><p>'+esc(memory.greeting)+'</p></section>':'';}
const locationMemoryMenu=menu;menu=function(which,data){locationMemoryMenu(which,data);const key=locationKeyForType(which);if(key&&panel===which)$('modal').innerHTML=locationMemoryHTML(key)+$('modal').innerHTML;};window.menu=menu;

// The notebook resumes from real business state, not a fragile saved counter.
// This repairs older imports and accepted host snapshots without touching a
// guest's personal slots.
const journeyLoad=load;load=function(...args){starterWait=0;journeyLoad(...args);reconcileJourney(false);};window.loadGame=load;
const journeyWire=wireChannel;wireChannel=function(ch){journeyWire(ch);const receive=ch.onmessage;ch.onmessage=e=>{const before=s;receive(e);if(s!==before)reconcileJourney(false);};};
const journeyMenu=menu;menu=function(which,data){journeyMenu(which,data);if(which==='journal')$('modal').innerHTML+=journeyGuideHTML(true);if(which==='pause')$('modal').innerHTML+=journeyGuideHTML(false);};window.menu=menu;

// Co-op partners can point to a place without changing the shared save or
// replacing an existing objective. Guest pings are corroborated against the
// host's fresh peer pose; replayed, stale-channel and out-of-world pings drop.
let partnerPing=null,pingSequence=0;
function activePartnerPing(){if(!partnerPing)return null;const status=coopPingStatus(partnerPing,player,performance.now());if(status.active)return partnerPing;if(track?.type==='coopPing')track=null;partnerPing=null;return null;}
function clearPartnerPing(){if(track?.type==='coopPing')track=null;partnerPing=null;}
function sendPartnerPing(){
 if(!net.connected||net.role==='solo'||net.ch?.readyState!=='open'){toast('Connect to a co-op partner first.');return;}
 if(!Number.isFinite(player.x)||!Number.isFinite(player.z)||player.x<WORLD.minX||player.x>WORLD.maxX||player.z<WORLD.minZ||player.z>WORLD.maxZ)return;
 if(net.role==='guest')netSend({type:'position',player:playerPacket()});
 netSend({type:'ping',seq:++pingSequence,x:player.x,z:player.z});toast('Location ping sent.');
}
function trackPartnerPing(){const ping=activePartnerPing();if(!ping)return;track={x:ping.x,z:ping.z,label:ping.from+' ping',type:'coopPing'};close();toast('Tracking '+ping.from.toLowerCase()+' ping.');}
function partnerPingHTML(){
 const ping=activePartnerPing();if(!ping)return '<section class="staffcard"><h3>Partner location ping</h3><p>No active ping. A received ping stays available for two minutes.</p></section>';
 const status=coopPingStatus(ping,player,performance.now()),district=DISTRICTS.reduce((a,b)=>Math.hypot(ping.x-a.x,ping.z-a.z)<Math.hypot(ping.x-b.x,ping.z-b.z)?a:b);
 return '<section class="staffcard"><h3>'+esc(ping.from)+' ping · '+esc(district.name)+'</h3><p>'+Math.round(status.distance)+' metres away · '+status.remainingSeconds+'s remaining</p><button class="primary" onclick="trackPartnerPing()">Track ping</button><button class="ghost" onclick="clearPartnerPing();menu(\'network\')">Clear</button></section>';
}
const coopPingWire=wireChannel;wireChannel=function(ch){
 coopPingWire(ch);const receive=ch.onmessage,closed=ch.onclose;let lastPingSequence=0;pingSequence=0;
 ch.onmessage=e=>{if(net.ch!==ch)return;let message;try{message=JSON.parse(e.data)}catch{return}if(message.type!=='ping'){receive(e);return}
  if(!net.connected||!['host','guest'].includes(net.role))return;
  const hostGuard=net.role==='host';if(hostGuard&&!freshExchangePose(net.remote,message,net.peerPoseSeenAt,performance.now()))return;
  const accepted=acceptCoopPing(message,net.remote,WORLD,performance.now(),lastPingSequence,hostGuard);if(!accepted.ok)return;
  lastPingSequence=accepted.sequence;partnerPing={...accepted.ping,from:net.role==='host'?'Partner':'Host'};toast(partnerPing.from+' ping received. Open Multiplayer to track it.');if(panel==='network')menu('network');
 };
 ch.onclose=()=>{if(net.ch!==ch)return;clearPartnerPing();closed?.();};
};
const coopPingDisconnect=disconnect;disconnect=function(...args){clearPartnerPing();pingSequence=0;coopPingDisconnect(...args);};
const coopPingPaint=paintTownMap;paintTownMap=function(ctx,w,h,local=false){
 const result=coopPingPaint(ctx,w,h,local),ping=activePartnerPing();if(!ping)return result;
 const scale=local?travelMapScale(driving):Math.min(w/740,h/700),center={x:local?player.x:0,z:local?player.z:(WORLD.minZ+95)/2},point=local?projectMapMarker(ping,center,scale,w,h,16):{x:w/2+(ping.x-center.x)*scale,y:h/2+(ping.z-center.z)*scale,offscreen:false,angle:0};
 ctx.fillStyle='#7de7eb';ctx.strokeStyle='#173e43';ctx.lineWidth=2;ctx.save();ctx.translate(point.x,point.y);if(point.offscreen)ctx.rotate(point.angle);ctx.beginPath();if(point.offscreen){ctx.moveTo(0,-9);ctx.lineTo(7,6);ctx.lineTo(0,3);ctx.lineTo(-7,6);}else{ctx.moveTo(0,-7);ctx.lineTo(7,0);ctx.lineTo(0,7);ctx.lineTo(-7,0);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();return {...result,pingOffscreen:!!point.offscreen};
};
const coopPingMenu=menu;menu=function(which,data){coopPingMenu(which,data);if(which==='network'&&active){$('modal').innerHTML+=row('Ping my location','Share your current map position for two minutes. No save data changes.','Send ping','sendPartnerPing()',!net.connected)+partnerPingHTML();}};window.menu=menu;
Object.assign(window,{sendPartnerPing,trackPartnerPing,clearPartnerPing});

// A small host-authored session trail makes cooperative work legible without
// adding save fields. Only verified state changes become canonical events;
// reconnect, replay and stale-channel packets cannot duplicate the trail.
let coopActivity=[],activitySequence=0;
const activityAction=doAction;doAction=function(k,...args){
 const connected=net.role==='host'&&net.connected,actor=processingRemote?'Partner':'Host',before=connected?activitySnapshot(s):null;
 activityAction(k,...args);
 if(!connected||net.role!=='host'||!net.connected)return;
 const next=activitySequence+1,event=deriveCoopActivity(k,args,before,activitySnapshot(s),actor,performance.now(),next);
 if(!event)return;activitySequence=next;coopActivity=appendCoopActivity(coopActivity,event);netSend({type:'activity',event});if(panel==='network')menu('network');
};
function coopActivityHTML(){
 if(!coopActivity.length)return '<section class="staffcard"><h3>Recent shared work</h3><p>No completed co-op actions in this connection yet.</p></section>';
 const names=STRAINS.map(strain=>strain.name);
 return '<section class="staffcard"><h3>Recent shared work</h3>'+[...coopActivity].reverse().map(event=>'<p>'+esc(coopActivityLine(event,names))+'</p>').join('')+'<p class="note">Session-only · host verified · newest first</p></section>';
}
const activityWire=wireChannel;wireChannel=function(ch){
 activityWire(ch);const receive=ch.onmessage,closed=ch.onclose;let lastActivitySequence=0;coopActivity=[];activitySequence=0;
 ch.onmessage=e=>{if(net.ch!==ch)return;let message;try{message=JSON.parse(e.data)}catch{return}if(message.type!=='activity'){receive(e);return}
  if(net.role!=='guest'||!net.connected)return;const accepted=acceptCoopActivity(message,lastActivitySequence);if(!accepted.ok)return;
  lastActivitySequence=accepted.sequence;coopActivity=appendCoopActivity(coopActivity,accepted.event);if(panel==='network')menu('network');
 };
 ch.onclose=()=>{if(net.ch!==ch)return;coopActivity=[];activitySequence=0;closed?.();};
};
const activityDisconnect=disconnect;disconnect=function(...args){coopActivity=[];activitySequence=0;activityDisconnect(...args);};
const activityMenu=menu;menu=function(which,data){activityMenu(which,data);if(which==='network'&&active)$('modal').innerHTML+=coopActivityHTML();};window.menu=menu;

// Existing durable state tells the whole spatial growth story. This portrait is
// read-only, so old saves and accepted host snapshots need no migration.
function businessPortraitHTML(){
 const portrait=businessPortrait(s),stageLine=portrait.stages.map(stage=>'<span class="tag">'+(stage.status==='past'?'✓ ':stage.status==='current'?'NOW · ':stage.status==='next'?'NEXT · ':'')+esc(stage.name)+'</span>').join(' → ');
 return '<section class="staffcard business-portrait"><h3>Business footprint</h3><p>'+stageLine+'</p><p><strong>'+esc(progressionSummary(portrait))+'</strong></p><p>'+portrait.ownedTents+' tents owned · '+portrait.current.stock+' total-goods capacity · '+portrait.current.storage+' stockroom capacity · '+portrait.equipment+'/6 major equipment upgrades · Level '+portrait.level+'</p><p>'+portrait.sold+' gummies sold · '+cash(portrait.earned)+' lifetime business income</p><p class="note">Next: '+esc(portrait.next)+'</p></section>';
}
const portraitMenu=menu;menu=function(which,data){portraitMenu(which,data);if(active&&['journal','pause','property','house','workshop'].includes(which))$('modal').innerHTML+=businessPortraitHTML();};window.menu=menu;

// The same modest fictional handset surrounds every phone function. Its status
// is derived from the current clock and connection only; there is no simulated
// battery, new save data or alternative network authority.
function phoneDeviceHTML(which){
 const status=phoneDeviceStatus(s,net,which);if(!status)return '';
 const signal=Array.from({length:4},(_,i)=>'<i class="'+(i<status.signal?'on':'')+'"></i>').join('');
 const nav=[['phone','MSG'],['contacts','PEOPLE'],['listing','LIST'],['deals','DEALS'],['wallet','CARD']].map(([screen,label])=>'<button '+(screen===which?'class="on" aria-current="page"':'')+' onclick="menu(\''+screen+'\')">'+label+'</button>').join('');
 return '<div class="device-status" aria-label="'+status.model+' phone status"><span><b>'+status.model+'</b><small>'+status.carrier+'</small></span><span class="device-screen">'+status.screen+'</span><span class="device-clock">'+s1Clock(s.day,s.time).clock+'<small>'+status.link+'</small></span><span class="device-signal" aria-label="Signal '+status.signal+' of 4">'+signal+'</span></div><nav class="device-keys" aria-label="Phone functions">'+nav+'</nav>';
}
const phoneDeviceMenu=menu;menu=function(which,data){phoneDeviceMenu(which,data);if(!Object.hasOwn(PHONE_SCREENS,which))return;$('overlay').classList.toggle('phone',true);const shell=phoneDeviceHTML(which),cut=shell.indexOf('<nav');$('modal').innerHTML=shell.slice(0,cut)+$('modal').innerHTML+shell.slice(cut);};window.menu=menu;

menu('title');requestAnimationFrame(frame);
if(streetShot){
 if(shotHour!=null){active=true;s.time=shotHour*60;}
 const hide=node=>{if(node)node.style.display='none';};
 hide($('overlay'));hide($('objective'));hide($('cross'));hide($('hint'));hide($('prompt'));hide($('work'));hide($('toast'));
 hide(document.querySelector('header'));hide(document.querySelector('.mapbox'));hide(document.querySelector('.hotbar'));hide(document.querySelector('.controls'));hide(document.querySelector('.stamina'));hide(document.querySelector('.location'));hide($('s1clock'));hide($('notifs'));
 const requested=new URLSearchParams(location.search).get('quality');if(requested)setQuality(requested);
 window.__gummyShot={
  status:()=>townAssetStatus,
  cam:(...c)=>{shotCam=c;return c;},hour:h=>{shotHour=((h%24)+24)%24;return shotHour;},colliders:()=>({colliders:colliders.map(c=>[+c.x.toFixed(1),+c.z.toFixed(1),+(c.w??0).toFixed(1),+(c.d??0).toFixed(1)]),points:points.map(p=>[p.type,+p.x.toFixed(1),+p.z.toFixed(1)]),player:[player.x,player.z]}),quality:q=>{setQuality(q);return quality;},drawBreakdown:()=>{camera.updateMatrixWorld();const fr=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse)),groups={};
  const walk=(o,top,vis)=>{if(!o.visible)return;if((o.isMesh||o.isLine||o.isPoints||o.isSprite)&&(!o.frustumCulled||(o.isSprite?true:(o.geometry.boundingSphere||o.geometry.computeBoundingSphere(),fr.intersectsObject(o))))){const k=top;groups[k]=(groups[k]||0)+(Array.isArray(o.material)?o.material.length:1);}for(const c of o.children)walk(c,top,vis);};
  for(const c of scene.children)walk(c,(c.name||c.type)+(c.isMesh?':'+(c.geometry?.type||''):''),true);return Object.entries(groups).sort((a,b)=>b[1]-a[1]).slice(0,40);},
 batchDebug:async()=>{const m=await import('./static-batch.mjs?v=139');const r={};const mats=new Map();for(const o of scene.children){const k=m.batchReject(o,scene)||'ok';const t=k+' '+(o.geometry?.type||o.type);r[t]=(r[t]||0)+1;if(k==='ok'){mats.set(o.material.uuid,(mats.get(o.material.uuid)||0)+1);}}const gn={};for(const o of scene.children)if(o.type==='Group'){const k=(o.name||'?')+' kids'+o.children.length;gn[k]=(gn[k]||0)+1;}const sm={};for(const o of scene.children){if(m.batchReject(o,scene)!=='')continue;if(mats.get(o.material.uuid)!==1)continue;const mm=o.material;const k=mm.type+' '+(o.name||'-')+' #'+mm.color?.getHexString()+' e'+mm.emissive?.getHexString()+' map'+!!mm.map;sm[k]=(sm[k]||0)+1;}const bs=scene.children.filter(o=>o.userData.staticBatch).map(o=>o.userData.staticBatch);const bm=new Set(scene.children.filter(o=>o.userData.staticBatch).map(o=>o.material.uuid)).size;camera.updateMatrixWorld();const fr=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));const vis={};for(const o of scene.children){if(!o.isMesh||!o.visible||o.userData.staticBatch)continue;if(o.frustumCulled&&!fr.intersectsObject(o))continue;const k=(m.batchReject(o,scene)||'ok')+' '+o.geometry.type+' '+(o.name||'');vis[k]=(vis[k]||0)+1;}const bk={};for(const o of scene.children)if(o.userData.batchKey){const k=o.userData.batchKey.split('|').slice(0,5).join('|');bk[k]=(bk[k]||0)+1;}return {bk,vis,bsizes:bs.sort((a,b)=>a-b).join(','),bmats:bm,gn,sm,singleMats:[...mats.values()].filter(v=>v===1).length,mats:mats.size,stats:window.__gummyBatcher?.stats()};},
 scene:()=>scene,callProfile:(detail=false)=>{if(shotCam){camera.position.set(shotCam[0],shotCam[1],shotCam[2]);camera.lookAt(shotCam[3],shotCam[4],shotCam[5]);camera.updateMatrixWorld();}const top=o=>{let a=o;while(a.parent&&a.parent!==scene)a=a.parent;if(detail){const m=o.material,r=[];if(Array.isArray(m))r.push('multi');else if(m){if(m.transparent)r.push('transp');if(m.map)r.push('map');if(m.emissive?.getHex?.())r.push('emis');}const u=Object.keys(o.userData||{});if(u.length)r.push('ud:'+u.join('+'));if(o.children.length)r.push('kids');if(o.renderOrder)r.push('ro');if(o.isInstancedMesh)r.push('inst');return (a.name||a.type+'@'+Math.round(a.position.x)+','+Math.round(a.position.z))+' > '+(o.name||o.geometry?.type||o.type)+' ['+r.join(',')+']';}return (a.name||a.type)+(a===o?':'+(o.geometry?.type||''):'');};const hits={},saved=[];scene.traverse(o=>{if(!o.isMesh&&!o.isLine&&!o.isPoints&&!o.isSprite)return;if(Object.prototype.hasOwnProperty.call(o,'onBeforeRender')){saved.push([o,o.onBeforeRender]);}else saved.push([o,null]);const prev=o.onBeforeRender,k=top(o);o.onBeforeRender=function(...a){hits[k]=hits[k]||{calls:0,tris:0};hits[k].calls++;const g=a[3];hits[k].tris+=g?((g.index?g.index.count:g.attributes.position?.count||0)/3*(o.isInstancedMesh?o.count:1)|0):0;return prev.apply(this,a);};});const info=renderer.info;info.autoReset=false;info.reset();try{renderFrame();}finally{info.autoReset=true;for(const [o,f] of saved){if(f)o.onBeforeRender=f;else delete o.onBeforeRender;}}return {calls:info.render.calls,triangles:info.render.triangles,top:Object.entries(hits).sort((a,b)=>b[1].calls-a[1].calls).slice(0,40)};},
 frameCalls:()=>{const info=renderer.info;info.autoReset=false;info.reset();try{renderFrame();return {calls:info.render.calls,triangles:info.render.triangles};}finally{info.autoReset=true;}},
 read:()=>{const recent=streetShotFrames.slice(-90);return {status:townAssetStatus,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,markings:starterStreet?.markingMesh.count??0,curbs:starterStreet?.hardscapeMesh.count??0,quality,budget:starterStreet?.activeBudget??'off',frames:streetShotFrames.length,frameMs:recent.length?recent.reduce((sum,ms)=>sum+ms,0)/recent.length:0};}
 };
}

// v129 loading flyover. A golden-hour tour of the districts runs behind the
// loading card and then behind the title menu. Any key or tap dismisses the
// card. Off for ?shot= and ?qa= runs and in the mocked test harness, so the
// first interactive frame and every existing path are unchanged there.
const cineLoadEl=typeof document!=='undefined'?document.getElementById('cineLoad'):null;
const cineView=cineLoadEl?.querySelector?createCineOverlay(cineLoadEl):null;
const cineParts=cineLoadEl?.querySelector?{hint:cineLoadEl.querySelector('.cine-hint span'),hintBox:cineLoadEl.querySelector('.cine-hint'),bar:cineLoadEl.querySelector('.cine-progress i'),label:cineLoadEl.querySelector('.cine-progress small'),cap:cineLoadEl.querySelector('.cine-cap')}:null;
const cineQuery=typeof location!=='undefined'&&typeof location.search==='string'?new URLSearchParams(location.search):null;
cine.flyover=!!(cineQuery&&cineView&&!streetShot&&!cineQuery.has('qa'));
if(cine.flyover)document.body?.classList?.toggle?.('cineFlyover',true);
cine.loading=cine.flyover;cine.hintOffset=Math.floor(Math.random()*30);
if(cineQuery&&cineQuery.has('cineT'))cine.seek=Number(cineQuery.get('cineT'))||0;
if(typeof THREE.DefaultLoadingManager!=='undefined')THREE.DefaultLoadingManager.onProgress=(url,loaded,total)=>{if(total>0)cine.items=loaded/total;};
if(!cine.flyover){if(cineLoadEl)cineLoadEl.hidden=true;document.body?.classList?.toggle?.('cineLoading',false);}
function cineFlyoverCamera(){
 const t=performance.now()/1000,dt=cine.last?Math.min(.1,Math.max(0,t-cine.last)):0;cine.last=t;
 cine.t=cine.seek!=null?cine.seek:cine.t+dt;
 const at=flyoverAt(cine.t),p=cine.pose||at.pose;
 camera.position.set(p.x,p.y,p.z);camera.lookAt(p.lookX,p.lookY,p.lookZ);
 if(Math.abs(camera.fov-p.fov)>.01){camera.fov=p.fov;camera.updateProjectionMatrix();}
 cine.lit=true;cine.grade=true;cine.minutes=FLYOVER_MINUTES;
 if(!cineView)return;
 cineView.fade(at.fade);
 if(at.index!==cine.shot){cine.shot=at.index;cineView.caption(at.district.toUpperCase(),at.line);}
 if(cineParts?.cap){const edge=Math.min(at.local-.5,at.shot.duration-.6-at.local);cineParts.cap.style.opacity=String(Math.max(0,Math.min(1,edge/.7)));}
 const hint=hintAt(cine.t,cine.hintOffset);
 if(hint.index!==cine.hint){cine.hint=hint.index;if(cineParts?.hint)cineParts.hint.textContent=hint.text;cineParts?.hintBox?.classList?.toggle?.('swap',cine.hint%2===0);}
}
function cineLoadProgress(){
 const town=townAssetStatus!=='loading'?1:cine.townBytes;
 return Math.max(cine.progress,Math.min(1,.12+town*.68+cine.items*.2));
}
function cineDismiss(){
 if(!cine.loading)return;cine.loading=false;
 cineLoadEl?.classList?.toggle?.('loading',false);document.body?.classList?.toggle?.('cineLoading',false);
 if(audioContext&&soundEnabled)playWhoosh(audioContext,audioContext.destination,{volume:.05});
}
function cineTick(){
 if(!cine.flyover||!cineLoadEl)return;
 if(active){if(cine.scene){introTick();return;}if(!cineLoadEl.hidden){cineLoadEl.hidden=true;}if(cine.lit&&!cine.scene){cine.lit=false;cine.grade=false;cine.shot=-1;camera.fov=fovBase;camera.updateProjectionMatrix();}return;}
 if(cineLoadEl.hidden){cineLoadEl.hidden=false;cine.shot=-1;cineView?.reset();}
 if(!cine.loading)return;
 cine.progress=cineLoadProgress();
 const ready=townAssetStatus!=='loading'&&(cine.items>=1||cine.readyAt&&performance.now()-cine.readyAt>6000);
 if(townAssetStatus!=='loading'&&!cine.readyAt)cine.readyAt=performance.now();
 if(cineParts?.bar)cineParts.bar.style.width=(ready?100:Math.round(cine.progress*100))+'%';
 if(cineParts?.label)cineParts.label.textContent=ready?'Press any key':townAssetStatus==='failed'?'Town artwork missing · press any key':'Building the town… '+Math.round(cine.progress*100)+'%';
 cineLoadEl.classList.toggle('live',townAssetStatus!=='loading');cineLoadEl.classList.toggle('ready',ready);
}
if(cine.flyover){
 addEventListener('keydown',e=>{if(cine.scene&&active){e.preventDefault();e.stopImmediatePropagation();if(e.key==='Escape'&&!e.repeat)finishArrival();return;}if(cine.loading&&!active){if(['Tab',' '].includes(e.key))e.preventDefault();cineDismiss();}},true);
 cineLoadEl.addEventListener('pointerdown',()=>cineDismiss());
}
if(typeof window!=='undefined')window.__cine={seek:t=>{cine.seek=t==null?null:Number(t);},pose:p=>{cine.pose=p?{fov:50,...p}:null;},state:()=>({t:cine.t,loading:cine.loading,lit:cine.lit,progress:cine.progress,town:townAssetStatus,items:cine.items,shot:cine.shot,hint:cine.hint,camera:camera.position.toArray().map(v=>Math.round(v*10)/10)}),dismiss:cineDismiss,clouds:skyClouds.group};

// v133 Act 1 intro, "Last Call". A new story save opens on a fifty-second
// cutscene: the radio explains the Great Jelly Incident and the Sugar-Free Bay
// Act, then the camera settles into the player's eyes beside the ringing
// payphone. It uses the same finishArrival() path as the old cards, so saves
// that have already seen the arrival or taken the call skip it. Esc or the Skip
// button ends it at any time. Without the overlay (tests, ?qa=, ?shot=) the old
// three cards still run.
const introPanelEl=cine.flyover&&typeof cineLoadEl?.insertBefore==='function'?document.createElement('div'):null;
if(introPanelEl){introPanelEl.className='cine-panel';cineLoadEl.insertBefore(introPanelEl,cineLoadEl.querySelector('.cine-fade'));}
const introSkipEl=cine.flyover&&cineLoadEl?.querySelector?.('.cine-skip')||null;
if(introSkipEl){introSkipEl.innerHTML='<button type="button">Skip intro <kbd>Esc</kbd></button>';introSkipEl.querySelector('button')?.addEventListener('click',e=>{e.stopPropagation();if(cine.scene)finishArrival();});}
const intro={t:0,last:0,panel:'',sfx:new Set(),props:null,from:null,handPose:null};
function introProps(){
 if(intro.props)return intro.props;
 const g=new THREE.Group();g.name='Act 1 table props';g.visible=false;
 // Rest each prop on the town's real camp table with one short downward ray.
 const ray=new THREE.Raycaster();ray.camera=camera;
 const rest=(x,z)=>{try{ray.set(new THREE.Vector3(x,2.4,z),new THREE.Vector3(0,-1,0));ray.far=2.2;const hit=ray.intersectObjects(scene.children,true).find(h=>h.object.visible&&h.object.isMesh&&h.point.y>.5&&h.point.y<1.2);return hit?hit.point.y:.82;}catch(e){return .82;}};
 const top=rest(-58.32,34.42);
 const tin=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.2,20),new THREE.MeshStandardMaterial({color:0xb84a3a,metalness:.55,roughness:.42}));tin.position.set(-58.32,top+.1,34.42);
 const lid=new THREE.Mesh(new THREE.CylinderGeometry(.178,.178,.04,20),new THREE.MeshStandardMaterial({color:0xd9b25a,metalness:.7,roughness:.3}));lid.position.set(-58.32,top+.215,34.42);lid.rotation.z=.08;
 let noteMat=new THREE.MeshStandardMaterial({color:0xf3ead2,roughness:.9});
 if(document.createElement){const c=document.createElement('canvas');c.width=256;c.height=192;const x=c.getContext&&c.getContext('2d');if(x){x.fillStyle='#f4ecd6';x.fillRect(0,0,256,192);x.strokeStyle='#c9d6e8';x.lineWidth=2;for(let y=40;y<192;y+=28){x.beginPath();x.moveTo(10,y);x.lineTo(246,y);x.stroke();}x.fillStyle='#2b2f5a';x.font='italic 26px Georgia, serif';x.fillText('Keep the lights',18,62);x.fillText('on, kid.',18,92);x.font='italic 30px Georgia, serif';x.fillText('—G',170,150);const tex=new THREE.CanvasTexture(c);if(THREE.SRGBColorSpace)tex.colorSpace=THREE.SRGBColorSpace;noteMat=new THREE.MeshStandardMaterial({map:tex,roughness:.9});}}
 const note=new THREE.Mesh(new THREE.PlaneGeometry(.44,.33),noteMat);note.rotation.set(-Math.PI/2,0,.28);note.position.set(-57.62,rest(-57.62,34.88)+.006,34.88);
 const env=new THREE.Mesh(new THREE.BoxGeometry(.32,.012,.18),new THREE.MeshStandardMaterial({color:0xcfa96b,roughness:.85}));env.position.set(-58.5,rest(-58.5,34.86)+.007,34.86);env.rotation.y=-.35;
 const band=new THREE.Mesh(new THREE.BoxGeometry(.06,.014,.185),new THREE.MeshStandardMaterial({color:0x3f8f5a,roughness:.7}));band.position.copy(env.position);band.position.y+=.002;band.rotation.y=-.35;
 const key=new THREE.Mesh(new THREE.BoxGeometry(.06,.01,.13),new THREE.MeshStandardMaterial({color:0xe2763c,roughness:.6}));key.position.set(-57.62,rest(-57.62,34.34)+.006,34.34);key.rotation.y=.7;
 g.add(tin,lid,note,env,band,key);scene.add(g);intro.props=g;return g;
}
function startIntro(){
 if(!cine.flyover||!cineView||!cineLoadEl||cine.scene)return false;
 cine.scene=true;cine.lit=true;cine.grade=true;intro.t=0;intro.last=0;intro.panel='';intro.sfx.clear();intro.from=null;
 menu('arrival');arrivalStarted=now;$('modal').innerHTML='';
 document.body.classList.add('cineScene');cineLoadEl.hidden=false;cineLoadEl.classList.add('scene');cineLoadEl.classList.remove('loading','live','ready');
 cineView.reset();cineView.show(true);cineView.bars(true);cineView.caption('','');cineView.subtitle('','');cineView.chyron('');cineView.fade(1);
 introProps();return true;
}
function endIntro(){
 cine.scene=false;cine.lit=false;cine.grade=false;cine.shot=-1;
 document.body.classList.remove('cineScene');cineLoadEl?.classList?.remove('scene');
 if(introPanelEl){introPanelEl.className='cine-panel';introPanelEl.innerHTML='';}intro.panel='';
 if(intro.props)intro.props.visible=false;
 cineView?.subtitle('','');cineView?.chyron('');cineView?.caption('','');cineView?.bars(false);cineView?.fade(0);
 if(cineLoadEl)cineLoadEl.hidden=true;
 camera.fov=fovBase;camera.updateProjectionMatrix();
 if(audioContext&&soundEnabled)playWhoosh(audioContext,audioContext.destination,{volume:.04});
}
function introSfx(name){
 if(!audioContext||!soundEnabled)return;
 if(name==='ring')playPhoneRing(audioContext,audioContext.destination,{rings:2,volume:.12});
 else if(name==='whoosh')playWhoosh(audioContext,audioContext.destination,{volume:.06});
}
function introTick(){
 const t=performance.now()/1000,dt=intro.last?Math.min(.1,Math.max(0,t-intro.last)):0;intro.last=t;
 intro.t=cine.seek!=null?cine.seek:intro.t+dt;
 const at=act1At(intro.t);
 if(at.done&&cine.seek==null){finishArrival();return;}
 cine.minutes=at.minutes;cine.lit=true;cine.grade=true;
 cineView.fade(at.fade);
 cineView.caption(at.cap?.title||'',at.cap?.line||'');
 if(cineParts?.cap)cineParts.cap.style.opacity=at.cap?'1':'0';
 cineView.subtitle(at.sub?.who||'',at.sub?.text||'');
 cineView.chyron(at.chyron?'<strong>'+at.chyron.head+'</strong><span>'+at.chyron.text+'</span>':'');
 const panel=at.panel?.panel||'';
 if(introPanelEl&&panel!==intro.panel){intro.panel=panel;introPanelEl.className='cine-panel'+(panel?' on '+panel:'');introPanelEl.innerHTML=panel?act1PanelHtml(panel):'';}
 if(intro.props)intro.props.visible=at.props;
 for(const name of at.sfx)if(!intro.sfx.has(name)){intro.sfx.add(name);if(cine.seek==null)introSfx(name);}
}
function introCameraPose(){
 const at=act1At(intro.t);let p=cine.pose||at.pose;
 if(at.handoff>0&&!cine.pose)p=blendPose(at.pose,doorstepEyePose(openingDoorstep(),fovBase),at.handoff);
 camera.position.set(p.x,p.y,p.z);camera.lookAt(p.lookX,p.lookY,p.lookZ);
 if(Math.abs(camera.fov-p.fov)>.01){camera.fov=p.fov;camera.updateProjectionMatrix();}
}
if(typeof window!=='undefined')window.__intro={start:()=>{if(active&&mode==='story')return startIntro();return false;},seek:t=>{cine.seek=t==null?null:Number(t);},state:()=>({scene:cine.scene,t:intro.t,panel:intro.panel,minutes:cine.minutes,duration:ACT1_DURATION,arrivalSeen:!!s.arrivalSeen})};

// Five graphics overhaul stages. Read-only presentation; no save schema changes.
const graphicsAtmosphere=createAtmosphereOverhaul({sky:skyDome,water:ocean});
const graphicsArchitecture=createArchitectureOverhaul(scene,DISTRICT_BUILDING_SITES);
const graphicsLandscape=createLandscapeOverhaul(scene,WORLD);
const graphicsLife=createLifeOverhaul({scene,actors:visualActors,homes:HOMES,vendorActors:points.filter(p=>p.actor).map(p=>p.actor)});
for(const mesh of [districtArchitecture.massMesh,districtArchitecture.roofMesh,graphicsArchitecture.groups[0],graphicsArchitecture.groups[2]])if(mesh)applyCoastalSurface(mesh.material);
const graphicsRender=renderFrame;
renderFrame=function(){
 graphicsAtmosphere.update(now,active?gbSky():undefined);
 graphicsArchitecture.update(sceneLighting(s.time,active).night,quality);
 graphicsLandscape.update(now,quality);
 graphicsLife.update({active,state:s,quality});
 graphicsRender();
};

// Shadier town pass: real metre-scaled surfaces and traversable hillside support.
const grittyGround=gritMaterial('earth'),grittyWalk=gritMaterial('concrete'),grittyRoad=gritMaterial('asphalt');
for(const mesh of scene.children){
 if(!mesh.isMesh||mesh.geometry.type!=='BoxGeometry'||mesh.position.y>.15)continue;
 const d=mesh.geometry.parameters;
 if(d.width>=200&&d.depth>100&&d.height<1)mesh.material=grittyGround;
 else if(d.height<.3&&((d.width>150&&d.depth>=10&&d.depth<=12)||(d.depth>80&&d.width>=10&&d.width<=12)))mesh.material=grittyRoad;
 else if(d.height<.3&&((d.width>100&&d.depth<=4.5)||(d.depth>80&&d.width<=4.5)))mesh.material=grittyWalk;
}
const grittyTerrain=createGrittyTerrain(scene,WORLD,grittyGround);
grittyTerrain.ridge.visible=false;
const islandSites=neighborhoodPlan({obstacles:colliders,points,height:terrainHeight});
const islandArchitecture=createDistrictArchitecture({scene,sites:islandSites,quality});
const islandDressing=createArchitectureOverhaul(scene,islandSites);
colliders.push(...islandSites);districtBuildings.push(...islandSites);
const islandShore=createIslandShore(scene,WORLD,grittyGround);
ocean.geometry.dispose();ocean.geometry=new THREE.PlaneGeometry(2200,2200,160,160);
ocean.position.set(0,-.375,(WORLD.minZ+WORLD.maxZ)/2);
// Older saves may stand on a newly built lot. Move those positions to a clear street.
const islandReset=resetSystems;resetSystems=function(){islandReset();
 const p=relocateFromInfill(player,islandSites,(x,z)=>!blocked(x,z));player.x=p.x;player.z=p.z;s.x=p.x;s.z=p.z;
 const v=relocateFromInfill(vehiclePose,islandSites,(x,z)=>!blocked(x,z)&&!blocked(x-2,z-3)&&!blocked(x+2,z+3));vehiclePose.x=v.x;vehiclePose.z=v.z;s.vehiclePark={...vehiclePose};
};
const streetWear=createStreetWear({scene,blocked,floorHeight:propFloorHeight,bounds:WORLD});
const grittyRender=renderFrame;renderFrame=function(){
 grittyTerrain.update(now);islandArchitecture.setQuality(quality);islandDressing.update(sceneLighting(s.time,active).night,quality);
 for(const g of avatars){const elevation=terrainHeight(g.position.x,g.position.z);if(elevation||g.userData.onHillside){g.position.y=elevation;g.userData.onHillside=elevation>0;}}
 grittyRender();
};
function phoneHome(){
 menu('phone');
 const status=phoneDeviceStatus(s,net,'phone'),orders=s.deals.length,packCount=s.packs.reduce((a,b)=>a+b,0);
 const homeDetail={phone:'Texts and offers',contacts:'Relationships',listing:s.listing?'Listing active':'Set a price',deals:orders+' agreed orders',wallet:cash(s.bank)+' on card',map:'Find your way'},badges=phoneBadges(s);
 $('modal').innerHTML=phoneDeviceHTML('phone').split('<nav')[0]+'<button class="close" onclick="closeMenu()" aria-label="Put phone away">×</button><div class="phone-home-clock">'+s1Clock(s.day,s.time).clock.replace(/ (AM|PM)$/,'<small> $1</small>')+'</div><p class="phone-home-day">'+s1Clock(s.day,s.time).weekday+' · Day '+s.day+'</p><div class="phone-app-grid">'+PHONE_HOME_APPS.map(app=>{const count=badges[app.screen]||0;return '<button onclick="menu(\''+app.screen+'\')" data-phone-key="'+app.key+'"><b aria-hidden="true">'+(APP_ICONS[app.screen]||app.icon)+(count?'<i class="app-badge">'+count+'</i>':'')+'</b><strong>'+app.name+'</strong><small>'+homeDetail[app.screen]+'</small><em>'+app.key+'</em></button>';}).join('')+'</div><p class="phone-keyhint">1–6 open apps · Tab puts the phone away</p><div class="phone-home-summary">'+packCount+' packs carried · '+cash(s.cash)+' cash</div>';
}
window.phoneHome=phoneHome;
const grittyPhoneMenu=menu;menu=function(which,data){grittyPhoneMenu(which,data);if(Object.hasOwn(PHONE_SCREENS,which))$('modal').innerHTML+='<button class="phone-home-button" onclick="phoneHome()" aria-label="Phone home">▰</button>';};window.menu=menu;

// Arrival and the first call share the real save/action paths. No separate tutorial inventory.
const ARRIVAL_LINES=[
 ['DRIFTWOOD CAMPSITE · 09:00','All he left you.','An old camper. Four hundred dollars. A town that already knows your grandfather.'],
 ['A NOTE ON THE TABLE','“Keep the lights on, kid.”','Gramps’s handwriting. Beside it, a motel key tag with the room number crossed out. Outside, the payphone keeps ringing.'],
 ['YOUR FIRST MORNING','Start with the call.','Walk to the payphone beside the camper. Everything else can wait.']
];
let arrivalPage=0,callPage=0,arrivalStarted=0;
function showArrival(index=0){
 if(!active||mode!=='story')return;
 if(index===0&&typeof startIntro==='function'&&startIntro())return;
 arrivalPage=Math.max(0,Math.min(2,index));if(arrivalPage===0)arrivalStarted=now;menu('arrival');
 const [label,title,text]=ARRIVAL_LINES[arrivalPage];
 $('modal').innerHTML='<div class="arrival-scene"><div class="overline">'+label+'</div><h2>'+title+'</h2><p>'+text+'</p><div class="arrival-actions"><button class="primary" onclick="advanceArrival()">'+(arrivalPage===2?'Step outside':'Continue')+'</button><button class="ghost" onclick="finishArrival()">Skip introduction</button></div><small>'+(arrivalPage+1)+' / 3</small></div>';
}
function stepOutsideRv(){if(!insideRvShell(player.x,player.z))return false;const step=openingDoorstep();player.x=step.x;player.z=step.z;yaw=step.yaw;pitch=0;s.x=step.x;s.z=step.z;s.yaw=step.yaw;s.pitch=0;return true;}
function finishArrival(){if(!active)return;if(cine.scene)endIntro();s.arrivalSeen=true;stepOutsideRv();close();syncPlayerView();camera.rotation.set(pitch,yaw,0);trackPlace('payphone');save();}
function advanceArrival(){if(arrivalPage<2)showArrival(arrivalPage+1);else finishArrival();}
function startRun(modeIn,slotIn){load(modeIn,slotIn);if(active&&mode===modeIn&&slot===slotIn&&mode==='story'&&!s.called&&!s.arrivalSeen)showArrival();else if(active){stepOutsideRv();syncPlayerView();camera.rotation.set(pitch,yaw,0);save();}}
const FIRST_CALL=[
 ['“Kid? It’s Gramps.”','They caught me selling gummy clusters out of the camper. My retirement plan has hit a small legal snag.'],
 ['“You need a roof.”','There’s four hundred in your wallet. Palm Court rents Room 04 for seventy-five. Find reception first.'],
 ['“One thing at a time.”','Once you have the room, check my notebook for the equipment list. Keep fifty dollars aside. And call me when you make your first sale.']
];
function showCallPage(index=0){
 callPage=Math.max(0,Math.min(2,index));const [title,text]=FIRST_CALL[callPage];
 $('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Hang up">×</button><div class="overline">COLLECT CALL · GRAMPS · '+(callPage+1)+' / 3</div><h2>'+title+'</h2><div class="message">'+text+'</div><button class="primary" onclick="'+(callPage<2?'showCallPage('+(callPage+1)+')':"finishFirstCall()")+'">'+(callPage<2?'Listen':'I’ll find the motel.')+'</button>';
}
function finishFirstCall(){if(panel!=='payphone'||s.called)return;action('call');if(s.called)trackPlace('reception');}
const arrivalMenu=menu;menu=function(which,data){arrivalMenu(which,data);if(which==='payphone'){if(!s.called)showCallPage(0);else $('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Hang up">×</button><div class="overline">COLLECT CALL · GRAMPS</div><h2>'+(s.sold?'You made a sale?':'Still here, kid.')+'</h2><div class="message">'+(s.sold?'You set the price and did the work. Good. Keep reinvesting. Better kit and good people will give you your time back.':esc(STORY[Math.min(s.chapter,STORY.length-1)].text))+'</div><button class="primary" onclick="action(\'call\')">Talk soon, Gramps.</button>';}};
Object.assign(window,{menu,startRun,showArrival,advanceArrival,finishArrival,showCallPage,finishFirstCall});

// Reused noise buffer and short filtered contact sounds; no new audio work until a gesture unlocks it.
let footstepNoise=null;
function playFootstep(){
 if(!soundEnabled||!audioContext||!audioLevels.master||!audioLevels.effects)return;
 try{
  if(!footstepNoise){footstepNoise=audioContext.createBuffer(1,Math.ceil(audioContext.sampleRate*.14),audioContext.sampleRate);const data=footstepNoise.getChannelData(0);let seed=731;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}}
  const t=audioContext.currentTime,source=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),gain=audioContext.createGain();
  const inside=floorHeight(player.x,player.z)>.1;
  source.buffer=footstepNoise;source.playbackRate.value=keys.shift?1.15:1;
  filter.type='lowpass';filter.frequency.value=inside?520:1450;gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime((keys.control?.012:.032)*audioLevels.master*audioLevels.effects,t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+.12);
  source.connect(filter);filter.connect(gain);gain.connect(audioContext.destination);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};source.start(t);source.stop(t+.14);
 }catch{}
}

// Outer neighbourhoods have usable shops, not only decorative house fronts.
const neighborhoodShops=[];
for(const service of [
 {type:'store',label:'North Bay Pantry',x:185,z:-355,color:0x79754e,skin:0xb77e58,hair:0x322b27},
 {type:'hardware',label:'Westside Tool Supply',x:-190,z:-230,color:0x536b77,skin:0xd3ad85,hair:0x837561},
 {type:'dealer',label:'Harbor Seed Counter',x:195,z:-145,color:0x637454,skin:0x98694f,hair:0x292724}
]){
 const candidates=islandSites.map((site,index)=>({site,profile:districtArchitectureProfile(site,index)})).filter(v=>v.profile.archetype==='bay-shop').sort((a,b)=>Math.hypot(a.site.x-service.x,a.site.z-service.z)-Math.hypot(b.site.x-service.x,b.site.z-service.z));
 for(const {site,profile:p} of candidates){
  if(neighborhoodShops.some(shop=>shop.site===site.id))continue;
  const front=p.front,normal={x:front.axis==='x'?front.sign:0,z:front.axis==='z'?front.sign:0},depth=front.axis==='x'?site.w:site.d;
  const x=site.x+normal.x*(depth/2+1.2),z=site.z+normal.z*(depth/2+1.2);
  if(blocked(x,z)||blocked(x+normal.x*1.4,z+normal.z*1.4))continue;
  const actor=bobble(x,z,service.color,service.skin,service.hair);actor.rotation.y=Math.atan2(normal.x,normal.z);actor.userData.neighborhoodShop=true;actor.position.y=floorHeight(x,z);
  const point=addPoint(service.type,service.label,x+normal.x*1.4,z+normal.z*1.4,{actor,site:site.id,neighborhood:true});
  const faceDepth=front.axis==='x'?p.w:p.d;
  sign(service.label,site.x+normal.x*(faceDepth/2+.11),2.8,site.z+normal.z*(faceDepth/2+.11),4.1,'#353e34','#e0d4b1',Math.atan2(normal.x,normal.z));
  neighborhoodShops.push(point);break;
 }
}
function trackNeighborhoodShop(index){const point=neighborhoodShops[index];if(!point)return;track={x:point.x,z:point.z,label:point.label};close();toast('Tracking '+point.label);}
const neighborhoodMenu=menu;menu=function(which,data){neighborhoodMenu(which,data);if(which==='map')$('modal').innerHTML+='<h3>Neighbourhood shops</h3>'+neighborhoodShops.map((point,i)=>row(point.label,point.type==='hardware'?'Tools and equipment':point.type==='dealer'?'Seeds and soil':'Wrappers and everyday supplies','Track','trackNeighborhoodShop('+i+')')).join('');};
Object.assign(window,{menu,trackNeighborhoodShop});

document.addEventListener('pointerlockchange',()=>document.body.classList.toggle('mouseCaptured',document.pointerLockElement===canvas));

// Existing trolley footprint and authoritative crew actions now have a physical terminal.
const workshopTerminals=createWorkshopTerminals({scene,homes:HOMES});
for(const point of points)if(point.type==='staffboard')point.label='BayBook computer · Crew and business';
const campsiteFire=createCampsiteFire({scene,x:-69,z:24,ground:floorHeight(-69,24)});
colliders.push({x:-69,z:24,w:1.45,d:1.45});
const terminalRender=renderFrame;renderFrame=function(){workshopTerminals.update({active,room:s.room,house:s.house});campsiteFire.update(now,sceneLighting(s.time,active).night);terminalRender();};
const terminalMenu=menu;menu=function(which,data){terminalMenu(which,data);if(which==='staffboard'){
 const access=physicalActionAccess('worker');

 $('modal').innerHTML='<div class="overline">BAYBOOK / LOCAL BUSINESS SYSTEM</div><h2>Your workshop, connected.</h2><p>'+cash(s.cash)+' cash · '+cash(s.bank)+' card · '+s.sold+' sold · '+cash(s.earned)+' earned</p>'+workshopPlanHTML()+businessPortraitHTML()+$('modal').innerHTML;
 }};window.menu=menu;

function workshopPlanHTML(){
 const plan=workshopPlan(s);
 return '<section class="staffcard"><h3>Today’s production plan</h3><p>'+plan.raw+' harvested · '+plan.loose+' loose · '+plan.wrappers+' wrappers</p><p><strong>'+plan.wrapNow+' ready to wrap now</strong> · '+plan.finishable+' total packs possible after shaping.</p><p>'+plan.available+' unpromised packs in your bag · '+plan.reserved+' promised · '+plan.stored+' stored · '+plan.inTransit+' worker batch in transit.</p>'+(plan.wrapperShortfall?'<p>To finish every harvested and loose batch, buy '+plan.wrapperShortfall+' more wrappers.</p><button class="ghost" onclick="trackPlace(\'store\')">Find wrappers</button>':'<p>Enough wrappers for all current harvested and loose batches.</p>')+(!s.packStation?'<p>Install a packaging station before wrapping.</p>':'')+plan.deadlines.map(d=>'<p>'+esc(CONTACTS[d.npc]?.name||'Customer')+' · '+(d.overdue?'overdue':d.minutes+' game minutes remaining')+'</p>').join('')+'</section>';
}

// Fleet purchases are host-owned, proximity-checked and replay-safe like other shops.
const fleetCommit=doAction;doAction=function(k,a,b,c){
 if(!['buyFleet','selectFleet'].includes(k)){fleetCommit(k,a,b,c);return;}
 if(!active||ensurePolice().search||!physicalActionAccess(k,a)?.ok)return;
 if(driving||net.connected&&net.remote?.vehicle){if(!processingRemote)toast('Park both vehicles before changing the shared fleet.');return;}
 const request=fleetRequest(s,a,k==='selectFleet');if(!request.ok){toast(request.reason);return;}
 if(k==='buyFleet'){if(!spend(request.profile.price))return;s.fleetUnlocks=[...new Set([...(Array.isArray(s.fleetUnlocks)?s.fleetUnlocks:[]),a])];}
 s.fleetSelected=a;save();if(!processingRemote)menu('garage');
};ACTION_NAMES.push('buyFleet','selectFleet');
const localFleetModels=createFleetModels(),peerFleetModels=createFleetModels();
function syncFleetModel(root,model){if(model.group.parent!==root)root.add(model.group);const spec=activeFleet(s);model.select(spec.id);for(const child of root.children)if(child!==model.group)child.visible=spec.id==='van';}
const fleetRender=renderFrame;renderFrame=function(){syncFleetModel(playerVan,localFleetModels);syncFleetModel(remoteVan,peerFleetModels);fleetRender();};
const fleetMenu=menu;menu=function(which,data){fleetMenu(which,data);if(!['garage','vehicle'].includes(which))return;
 const current=activeFleet(s),access=physicalActionAccess('buyFleet');
 $('modal').innerHTML='<button class="close" onclick="closeMenu()">×</button><div class="overline">HARBOR MOTORS / FLEET</div><h2>Your next set of wheels.</h2><p>Selected: '+current.name+'. Purchases use '+(s.payment==='card'?'your card':'cash')+'. Park both players before changing the fleet.</p><p class="note">'+esc(access.reason)+'</p>';
 for(const spec of FLEET){const owned=fleetOwned(s,spec.id),selected=owned&&current.id===spec.id,request=fleetRequest(s,spec.id);const disabled=selected||!access.ok||driving||!!(net.connected&&net.remote?.vehicle)||(!owned&&(spec.id==='van'?level()<2||availableMoney()<750:!request.ok));
 $('modal').innerHTML+=row(spec.name,spec.description+' Level '+spec.level+' · '+Math.round(spec.top*3.6)+' km/h before road limits.',selected?'SELECTED':owned?'Select':cash(spec.price),spec.id==='van'&&!owned?"action('buyVehicle')":owned?"action('selectFleet','"+spec.id+"')":"action('buyFleet','"+spec.id+"')",disabled);}
 if(s.vehicleOwned)$('modal').innerHTML+=row('Drive selected vehicle','Approach a clear side door on level ground. Stop before exiting.','Drive','enterVehicle()',!entryDoor());
};window.menu=menu;

const fleetControlsUpdate=update;update=function(dt){fleetControlsUpdate(dt);const exit=$('vehicleExit');exit.hidden=!active||!driving||!!panel;exit.disabled=Math.abs(driveSpeed)>1;exit.textContent=exit.disabled?'Stop to exit':'Exit vehicle [F]';};

// Direct object handling stays in the authoritative action pipeline.
const tactilePropAct=act;act=function(){
 if(active&&!panel&&!work&&!driving&&!placeMode&&near?.type==='prop'){
  ensureProps();const owner=net.role==='guest'?'guest':'host';
  if(s.props.some(p=>p.owner===owner)){action('dropProp');return;}
  const index=chooseParcel(s.props,player,yaw,pitch,p=>propReachable(player,p,blocked,3,propOverheadBands));
  if(index>=0)action('grabProp',index);return;
 }
 tactilePropAct();
};window.act=act;
const parcelFinish=createParcelFinish(scene,propMeshes);
const tactilePropRender=renderFrame;renderFrame=function(){
 parcelFinish.update(s.props||[],{active,floorHeight:propFloorHeight,actor:player,yaw,pitch,eligible:p=>propReachable(player,p,blocked,3,propOverheadBands),focused:!panel&&!work&&!driving});
 tactilePropRender();
};
const carryHint=document.createElement('div');carryHint.id='carryHint';carryHint.hidden=true;document.body.appendChild(carryHint);
const tactilePropUI=updateUI;updateUI=function(){tactilePropUI();
 const held=s.props?.some(p=>p.owner===(net.role==='guest'?'guest':'host'));
 carryHint.hidden=!active||!!panel||!!work||!held;
 carryHint.textContent='CARRYING PARCEL  ·  G throw  ·  Shift + G set down';
 if(active&&!panel&&!work&&near?.type==='prop'){
  const index=chooseParcel(s.props||[],player,yaw,pitch,p=>propReachable(player,p,blocked,3,propOverheadBands));
  $('prompt').style.display=held||index>=0?'block':'none';
  $('prompt').innerHTML='<span class="key">E</span>'+(held?'Set down parcel':'Pick up parcel')+'<small>'+(held?'Or G to throw in the direction you look':'Aim at the crate · no menu')+'</small>';
 }
};

const parcelJournalMenu=menu;menu=function(which,data){parcelJournalMenu(which,data);
 if(which==='journal'){
  const found=PARCEL_NOTES.map((note,i)=>s.parcelNotes?.[i]?note:null).filter(Boolean);
  $('modal').innerHTML+='<section class="parcel-notes"><div class="overline">DEAD LETTERS · '+found.length+' / '+PARCEL_NOTES.length+'</div><h3>Something is off in this town.</h3><p>Inspect the reusable parcels scattered around town by picking them up. Their old shipping notes are kept here.</p>'+found.map(note=>'<article><h3>'+esc(note.title)+'</h3><p>'+esc(note.text)+'</p></article>').join('')+'</section>';
 }
};window.menu=menu;

// v121: neighbourhood-specific masonry, sheet metal and worn render on room shells.
for(const [i,b] of buildings.entries()){
 const kind=['brick','plaster','iron','concrete','wood'][i%5];
 scene.traverse(o=>{
  if(!o.isMesh||o.parent!==scene||o.geometry.type!=='BoxGeometry')return;
  const g=o.geometry.parameters;if(g.height<.55||Math.min(g.width,g.depth)>.32)return;
  const dx=Math.abs(o.position.x-b.x),dz=Math.abs(o.position.z-b.z);
  if(dx>b.w/2+.18||dz>b.d/2+.18)return;
  const onSide=Math.abs(dx-b.w/2)<.18,onEnd=Math.abs(dz-b.d/2)<.18;
  if(!onSide&&!onEnd)return;
  o.material=surface(kind,Math.max(g.width,g.depth),g.height,[0xa9a39a,0xb0afa0,0x929b95,0xa7aaa0,0xa7a18c][i%5]);
 });
}

// Soft contact darkening inside existing service lanes; no change to walkable paths.
for(const lane of NARROW_ALLEY_PROFILES)contact(lane.x,lane.laneZ,lane.screenLength+1,lane.clearWidth+1);

// Procedural score, foley and mixer. The install is skipped when an older harness strips the import.
if(typeof createTownAudio==='function')try{
 if(!Object.hasOwn(audioLevels,'music'))audioLevels.music=.55;
 try{audioLevels.music=readAudioLevels(localStorage.getItem(AUDIO_STORAGE_KEY)).music;}catch{}
 const townAudio=createTownAudio({levels:audioLevels,storage:localStorage,onPersistError(){toast('Audio setting applies for this session.');}});
 window.townAudio=townAudio;
 let saleCue=false;
 function playCue(name,detail){if(!name)return;if(name==='sale'){if(saleCue)return;saleCue=true;queueMicrotask(()=>{saleCue=false;});}townAudio.emit(name,detail);}
 if(typeof subscribeGameplay==='function')subscribeGameplay(event=>{const cue=cueForGameplay(event);if(cue)playCue(cue,{voice:event.npc,x:player.x,z:player.z});});
 setVolume=function(key,value){townAudio.setVolume(key,value);};
 window.setVolume=setVolume;
 ambientGain=ambientGain||{gain:{value:0,setTargetAtTime(){}}};
 const phoneScreens=new Set(['phone','thread','listing','deals','wallet']);
 const dialogueScreens=new Set(['thread','customer','payphone']);
 function unlockTownAudio(){const AC=window.AudioContext||window.webkitAudioContext;if(AC&&!audioContext){try{audioContext=new AC();}catch{audioContext=null;}}if(audioContext)townAudio.unlock(audioContext);}
 addEventListener('pointerdown',unlockTownAudio);
 addEventListener('mousedown',unlockTownAudio);
 addEventListener('keydown',unlockTownAudio);
 document.addEventListener('click',event=>{if(event.target?.closest?.('button'))townAudio.emit('ui');},true);
 playFootstep=function(){if(!soundEnabled||driving)return;const raised=rvFloorHeight(player.x,player.z)>0.2||tentSupportHeight(player.x,player.z)>0.2||verticalTownFloorHeight(player.x,player.z)>0.2;townAudio.emit('footstep',{surface:footstepSurface(player.x,player.z,raised?1:0),crouch:!!keys.control,sprint:!!keys.shift,x:player.x,z:player.z});};
 const townAction=doAction;doAction=function(k,a,b,c){const xp=s.xp,cashBefore=s.cash,bankBefore=s.bank;townAction(k,a,b,c);if(!isManualAction(k))playCue(cueForAction(k),{x:player.x,z:player.z});if(s.xp>xp)townAudio.emit('xp');if((s.cash!==cashBefore||s.bank!==bankBefore)&&k!=='deliver')townAudio.emit('cash');if(k==='mix'&&b===1)townAudio.emit('warble');};
 const townGuest=action;action=function(k,a,b,c){const guest=net.role==='guest'&&active;const result=townGuest(k,a,b,c);if(guest&&!isManualAction(k))playCue(cueForAction(k),{x:player.x,z:player.z});if(guest&&k==='mix'&&b===1)townAudio.emit('warble');return result;};window.action=action;
 const townStation=advanceStation;advanceStation=function(amount){const before=stationTask?{k:stationTask.k,step:stationTask.step}:null;townStation(amount);if(!before)return;const changed=!stationTask||stationTask.step!==before.step||stationTask.k!==before.k;if(!changed)return;const cue=stationCue(before.k,before.step);if(cue)townAudio.emit(cue,{x:player.x,z:player.z});};
 const townEnter=enterVehicle;enterVehicle=function(){const was=driving;townEnter();if(!was&&driving)townAudio.emit('door',{kind:'metal',x:player.x,z:player.z});};
 const townExit=exitVehicle;exitVehicle=function(){const was=driving;townExit();if(was&&!driving)townAudio.emit('door',{kind:'metal',x:player.x,z:player.z});};
 Object.assign(window,{enterVehicle,exitVehicle});
 const townMenu=menu;menu=function(which,data){const prev=panel;townMenu(which,data);if(which==='settings'&&$('modal'))$('modal').innerHTML=replaceAudioMixer($('modal').innerHTML,audioLevels);if(phoneScreens.has(which)&&!phoneScreens.has(prev))townAudio.emit('message');if((which==='customer'||which==='thread')&&Number.isInteger(data)&&which!==prev)townAudio.emit('bark',{voice:data,force:true,x:player.x,z:player.z});};window.menu=menu;
 let townHeard=performance.now();
 const townFrame=renderFrame;renderFrame=function(){townFrame();try{const t=performance.now(),dt=Math.min(.05,Math.max(0,(t-townHeard)/1000));townHeard=t;const home=HOMES[s.house];const indoors=!!(s.room&&home&&Math.abs(player.x-home.x)<home.w/2&&Math.abs(player.z-home.z)<home.d/2);let police='clear',officers=null;if(active&&s.police){police=currentPoliceFeedback().stage;officers=s.police.officers;}townAudio.setEnabled(soundEnabled);townAudio.update({time:s.time,active,enabled:soundEnabled,indoors,driving,speed:driveSpeed,panel,station:stationTask?.k||'',x:player.x,y:player.y,z:player.z,yaw,dialogue:dialogueScreens.has(panel),police,officers,npcs:CONTACTS.map((c,id)=>({id,x:c.x,z:c.z})),now:t/1000,dt,rain:0});}catch(e){console.warn('Town audio update skipped',e);}};
}catch(e){console.warn('Town audio unavailable',e);}

// Contacts and deal satisfaction read the existing relationship score. Street
// dealers stay absent unless the simulation supplies state.dealers.
function contactSource(){
 return buildContactBook({state:s,strainNames:STRAINS.map(item=>item.name),contacts:CONTACTS.map((contact,index)=>({name:contact.name,line:contact.line,role:customerVoice(index).role,favourite:INGREDIENTS[index%INGREDIENTS.length].effect}))});
}
function insertBeforePhoneNav(fragment){
 const html=$('modal').innerHTML,at=html.indexOf('<nav class="device-keys"');
 $('modal').innerHTML=at<0?html+fragment:html.slice(0,at)+fragment+html.slice(at);
}
const contactsMenu=menu;menu=function(which,data){
 contactsMenu(which,data);
 if(!active)return;
 if(which==='contacts'){insertBeforePhoneNav(contactBookHTML(contactSource(),esc));return;}
 if(which!=='customer'&&which!=='thread')return;
 const index=Number.isInteger(data)?data:selected;
 if(!CONTACTS[index])return;
 const thread=s.threads?.[index];
 const view=satisfactionView(relationship(index),satisfactionContext({surface:which,negotiating:thread?.status==='negotiating',hasDeal:Array.isArray(s.deals)&&s.deals.some(item=>item&&item.npc===index),hasReceipt:!!thread?.lastSale}));
 insertBeforePhoneNav(satisfactionHTML(view,esc));
};
window.menu=menu;
addEventListener('keydown',e=>{
 if(!active||e.repeat||e.metaKey||e.ctrlKey||e.altKey)return;
 const tag=document.activeElement?.tagName;
 if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
 if(!panel||$('overlay').hidden||(panel!=='map'&&!Object.hasOwn(PHONE_SCREENS,panel)))return;
 if(e.key==='Backspace'){e.preventDefault();phoneHome();return;}
 const next=PHONE_APP_KEYS[e.key];
 if(!next)return;
 e.preventDefault();menu(next);
});
let curfewSeen='';
function paintHudReadout(){
 if(!$('clock'))return;
 const clock=weekdayClock(s.day,s.time);
 $('clock').textContent=clock.label;
 const slot=$('cashSlotValue');if(slot)slot.textContent=cash(s.cash);
 const police=s.police||{},role=typeof localPoliceRole==='function'?localPoliceRole():'host';
 const officers=Array.isArray(police.officers)?police.officers.filter(officer=>officer&&officer.target===role):[];
 const stage=police.search?'search':officers.some(officer=>officer.mode==='pursuit')?'pursuit':officers.some(officer=>officer.mode==='stop'||officer.suspicion>10)?'watching':'clear';
 const banner=policeBanner({heat:s.heat,stage,searchRemaining:police.search?.remaining,armed:police.armed===true,duration:4});
 const plate=$('wantedBanner');
 if(plate){plate.hidden=!active||!banner.visible;plate.dataset.state=banner.id;}
 if($('wantedLabel'))$('wantedLabel').textContent=banner.label;
 const bar=$('searchCountdown'),fill=$('searchFill');
 if(bar)bar.hidden=banner.countdown===null;
 if(fill&&banner.countdown!==null)fill.style.width=Math.round(banner.countdown*100)+'%';
 const view=compassView({yaw,x:player.x,z:player.z,markers:hudMarkers()});
 const compass=$('compass');
 if(compass)compass.innerHTML='<div class="compass-window" aria-label="Facing '+view.cardinal+'"><i class="compass-tick"></i><div class="compass-marks">'+view.markers.map(marker=>'<span class="compass-mark" style="left:calc(50% + '+Math.max(-180,Math.min(180,marker.offset))+'px)"><b>'+esc(marker.icon)+'</b><em>'+esc(marker.label)+'</em><small>'+marker.metres+' m</small></span>').join('')+'</div><strong>'+view.cardinal+'</strong></div>';
}
function hudMarkers(){
 const markers=[];
 if(track&&Number.isFinite(track.x)&&Number.isFinite(track.z))markers.push({id:'track',label:track.label||'Objective',icon:'◆',x:track.x,z:track.z});
 for(const deal of Array.isArray(s.deals)?s.deals.slice(0,3):[]){const person=CONTACTS[deal.npc];if(!person)continue;const live=s.npcs?.[deal.npc];markers.push({id:'deal'+deal.npc,label:person.name,icon:'●',x:Number.isFinite(live?.x)?live.x:person.x,z:Number.isFinite(live?.z)?live.z:person.z});}
 return markers;
}
const hudReadoutUI=updateUI;updateUI=function(){hudReadoutUI();paintHudReadout();};
const curfewStep=update;update=function(dt){curfewStep(dt);if(!active||net.role==='guest')return;const cue=curfewCue(s.day,s.time);if(!cue)return;const key=cue.day+':'+cue.id;if(curfewSeen===key)return;curfewSeen=key;toast(cue.text);};

// Town map and shop counter are presentation. Purchases still go through action().
let shopOffers=[],pendingShop=null,shopRefund=null;
function copyShopList(value){return Array.isArray(value)?value.map(item=>item&&typeof item==='object'?{...item}:item):[];}
function captureShopState(){
 return {cash:s.cash,bank:s.bank,tents:s.tents,plants:copyShopList(s.plants),can:s.can,lights:s.lights,irrigation:s.irrigation,bench:s.bench,mixer:s.mixer,packStation:s.packStation,trimmers:s.trimmers,seeds:copyShopList(s.seeds),soil:s.soil,wrappers:s.wrappers,ingredients:copyShopList(s.ingredients),ledger:copyShopList(s.ledger)};
}
function restoreShopState(before){
 if(!before)return;
 s.cash=before.cash;s.bank=before.bank;s.tents=before.tents;s.plants=copyShopList(before.plants);
 s.can=before.can;s.lights=before.lights;s.irrigation=before.irrigation;s.bench=before.bench;s.mixer=before.mixer;s.packStation=before.packStation;s.trimmers=before.trimmers;
 s.seeds=copyShopList(before.seeds);s.soil=before.soil;s.wrappers=before.wrappers;s.ingredients=copyShopList(before.ingredients);s.ledger=copyShopList(before.ledger);
}
function openShopConfirm(index){
 const offer=shopOffers[index];
 if(!offer||!SHOP_PANELS.includes(panel))return;
 pendingShop={...offer,panel};
 const caution=offer.action==='buyTent'?(s.tents>0?`You already own ${s.tents} tent${s.tents===1?'':'s'}. The first-day list needs only one. Another tent is $100, and the starter list is about $350 from a $400 start.`:'One tent is enough to start. The notebook list is about $350: room $75, tent $100, can $15, trimmers $10, packaging $100, seed $30, soil $10 and wrappers $10.'):'';
 $('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Close">×</button>'+shopConfirmHTML({...offer,caution},{cash:s.cash,bank:s.bank,payment:s.payment});
}
function closeShopConfirm(){pendingShop=null;if(SHOP_PANELS.includes(panel))menu(panel);else close();}
function acceptShopConfirm(){
 const offer=pendingShop;if(!offer)return;
 const before=captureShopState(),which=offer.panel;
 shopRefund=null;
 action(offer.action,offer.args[0],offer.args[1],offer.args[2]);
 if(JSON.stringify(captureShopState())===JSON.stringify(before))return;
 shopRefund={before,name:offer.name,price:offer.price,panel:which};
 pendingShop=null;
 if(panel!==which)return;
 const html=$('modal').innerHTML.replace(/<div id="shopRefund"[\s\S]*?<\/div>/,'');
 $('modal').innerHTML=html+shopRefundHTML(shopRefund,net.role==='guest');
}
function refundShopPurchase(){
 if(!shopRefund||net.role==='guest')return;
 const refund=shopRefund;shopRefund=null;pendingShop=null;
 restoreShopState(refund.before);save();toast('Refunded '+refund.price+' for '+refund.name+'.');
 if(SHOP_PANELS.includes(refund.panel))menu(refund.panel);
}
function dismissShopRefund(){shopRefund=null;pendingShop=null;if(SHOP_PANELS.includes(panel))menu(panel);}
Object.assign(window,{openShopConfirm,acceptShopConfirm,closeShopConfirm,refundShopPurchase,dismissShopRefund});
const counterMenu=menu;menu=function(which,data){
 counterMenu(which,data);
 if(!active)return;
 if(which==='map'){$('modal').innerHTML=revealTownPlaces($('modal').innerHTML);return;}
 if(!SHOP_PANELS.includes(which))return;
 const armed=armShopMarkup($('modal').innerHTML);
 shopOffers=armed.offers;
 $('modal').innerHTML=armed.html+(shopRefund&&shopRefund.panel===which&&!armed.html.includes('id="shopRefund"')?shopRefundHTML(shopRefund,net.role==='guest'):'');
};window.menu=menu;

// Messages, the contact graph and marketplace rows read the save. They do not
// decline a live offer, reschedule a meetup, or unlist a product.
let contactFocus=0,counterFor=null,counterArmed=false;
function phoneSwatch(color){const hex=(Number(color)>>>0).toString(16).padStart(6,'0').slice(-6);return '#'+hex;}
function phoneDistrict(person){return (person.x<0?'West':'East')+' side · '+(person.z<0?'north':'south')+' of Main Street';}
function phoneEffects(index){
 const known=!!s.threads?.[index]?.lastSale||(Array.isArray(s.deals)&&s.deals.some(deal=>deal&&deal.npc===index));
 return known?[INGREDIENTS[index%INGREDIENTS.length].effect]:null;
}
function insertAfterClose(fragment){
 const html=$('modal').innerHTML,token='aria-label="Close">×</button>';
 const at=html.indexOf(token);
 if(at<0){insertBeforePhoneNav(fragment);return;}
 const cut=at+token.length;
 $('modal').innerHTML=html.slice(0,cut)+fragment+html.slice(cut);
}
function showContactCard(index){if(!Number.isInteger(index)||!CONTACTS[index])return;contactFocus=index;menu('contacts');}
function openCounterSheet(index){if(!Number.isInteger(index))return;counterFor=index;counterArmed=true;menu('thread',index);}
function closeCounterSheet(){counterFor=null;counterArmed=false;if(panel==='thread')menu('thread',selected);}
function previewCounterChance(){
 const input=document.getElementById('counterPrice'),node=document.getElementById('counterChance');
 if(!input||!node)return;
 node.textContent=acceptChance(Number(input.value),Number(input.dataset.fair))+'%';
}
function phoneProductRows(){
 const rows=[];
 for(let i=0;i<STRAINS.length;i++){
  const item=STRAINS[i],owned=(s.packs[i]||0)+(s.gummies[i]||0)+(s.raw[i]||0)+(s.seeds[i]||0)>0||s.listing?.t===i;
  if(item.mixed&&!owned)continue;
  const effect=item.mixed?INGREDIENTS[item.ingredient].effect:'Plain';
  const recipe=item.mixed?'Mix '+STRAINS[item.base].name+' with '+INGREDIENTS[item.ingredient].name+'.':item.name+' grows from its seed. Harvest, shape, then wrap. No flavour mix.';
  rows.push({index:i,name:item.name,swatch:phoneSwatch(item.color),effects:[effect],market:value(i),price:s.listing?.t===i?s.listing.price:value(i),qty:s.listing?.t===i?s.listing.qty:1,packed:s.packs[i]||0,listed:s.listing?.t===i,recipe});
 }
 return rows;
}
Object.assign(window,{showContactCard,openCounterSheet,closeCounterSheet,previewCounterChance});
const appsMenu=menu;menu=function(which,data){
 appsMenu(which,data);
 if(!active)return;
 if(which==='phone'){
  const inbox=buildInbox({contacts:CONTACTS.map(person=>({name:person.name,swatch:phoneSwatch(person.color),line:person.line})),threads:s.threads,deals:s.deals,strainNames:STRAINS.map(item=>item.name)});
  insertAfterClose(inboxHTML(inbox,esc));
  return;
 }
 if(which==='thread'){
  const index=Number.isInteger(data)?data:selected;
  const thread=s.threads?.[index];
  const view=negotiationView(thread,STRAINS[thread?.t]?.name,s.time);
  const showSheet=counterArmed&&counterFor===index;
  counterArmed=false;
  if(!view)return;
  insertAfterClose(dealBubbleHTML(index,view,esc)+(showSheet?counterSheetHTML(index,view,esc):''));
  return;
 }
 if(which==='contacts'){
  const people=CONTACTS.map((person,index)=>{
   const craving=cravingState(s.cravings?.[index],s.day);
   return {index,name:person.name,swatch:phoneSwatch(person.color),score:relationship(index),district:phoneDistrict(person),standards:'',effects:phoneEffects(index),craving:craving&&STRAINS[craving.product]?{name:STRAINS[craving.product].name,level:craving.level}:null};
  });
  insertAfterClose(contactGraphHTML(contactGraphModel({people,selected:contactFocus}),esc));
  return;
 }
 if(which==='listing')insertAfterClose(productRowsHTML(phoneProductRows(),esc));
};window.menu=menu;

// v128: close-up pour, seed, drizzle and seal. Supplies still commit only when the station finishes.
let benchSession=null,pendingCraft=null,benchCommit=false;
try{
 benchSession=createBenchSession({THREE,scene,camera,canvas,emit(kind){
  const cue={pour:'water',spill:'trash',pop:'pickup',snap:'gummy',drizzle:'water',crimp:'wrapper',drop:'pickup',done:'xp',skip:'ui'}[kind];
  if(cue&&window.townAudio?.emit)window.townAudio.emit(cue,{x:player.x,z:player.z});
  playBenchCue(audioContext,kind,soundEnabled);
 }});
}catch(error){console.warn('Bench minigames unavailable',error);benchSession=null;}
const normalizeCraft=normalize;
normalize=function(v){const next=normalizeCraft(v);ensureCraftQuality(next);return next;};
ensureCraftQuality(s);
function commitBench(score){
 if(!stationTask)return;
 pendingCraft={actionK:stationTask.batch?'batch':stationTask.k,kind:stationTask.k,index:stationTask.batch?stationTask.batch.index:stationTask.a,quality:score.quality,complaint:score.complaint||0,skipped:!!score.skipped};
 const task=stationTask;
 task.benchLive=false;
 benchCommit=true;
 try{
  let guard=0;
  while(stationTask&&stationTask.k===task.k&&guard++<8){
   const step=MANUAL[stationTask.k]?.[stationTask.step];
   if(!step)break;
   advanceStation((step[2]||1)*Math.sqrt(stationTask.batch?.count||1)+1);
  }
 }finally{
  benchCommit=false;
  if(pendingCraft&&!stationTask)pendingCraft=null;
 }
}
if(benchSession){benchSession.onComplete=commitBench;benchSession.onCancel=()=>{if(stationTask)cancelStation();};}
const advanceBench=advanceStation;
advanceStation=function(amount){if(stationTask?.benchLive&&!benchCommit)return;advanceBench(amount);};
const stationInputBench=updateStationInput;
updateStationInput=function(dt){
 if(stationTask?.benchLive&&benchSession){
  if(!active||document.hidden)return;
  stationTask.elapsed+=Math.min(.06,dt);
  benchSession.tick(dt,{assist:!!stationAssist});
  return;
 }
 stationInputBench(dt);
};
const paintBench=paintStation;
paintStation=function(){
 if(stationTask?.benchLive&&benchSession){benchSession.syncHud();const hud=$('stationHUD');if(hud)hud.hidden=true;return;}
 paintBench();
};
const cancelForBench=cancelStation;
cancelStation=function(){
 const finishing=benchCommit;
 if(benchSession?.active)benchSession.close(true);
 cancelForBench();
 if(!finishing)pendingCraft=null;
};
window.cancelStation=cancelStation;
const stationControlBench=stationControl;
stationControl=function(down){if(stationTask?.benchLive){stationAssist=!!down;return;}stationControlBench(down);};
window.stationControl=stationControl;
const craftAction=doAction;
doAction=function(k,a,b,c){
 const note=pendingCraft&&pendingCraft.actionK===k?pendingCraft:null;
 const plant=(k==='harvest'||k==='plant'||k==='prepare'||k==='water')?s.plants?.[a]:null;
 const keptPour=k==='plant'&&Number.isFinite(plant?.pour)?plant.pour:undefined;
 const strain=k==='harvest'?plant?.t:(k==='batch'?a?.index:a);
 const rawBefore=Number.isInteger(strain)?(s.raw?.[strain]||0):0;
 const gummyBefore=Number.isInteger(strain)?(s.gummies?.[strain]||0):0;
 const packsBefore=Number.isInteger(strain)?(s.packs?.[strain]||0):0;
 const soldBefore=s.sold;
 const deal=k==='deliver'?s.deals?.find(d=>d.npc===a):null;
 craftAction(k,a,b,c);
 if(k==='prepare'&&note&&s.plants?.[a]?.phase==='soil')s.plants[a].pour=note.quality;
 if(k==='plant'&&note&&s.plants?.[a]){if(Number.isFinite(keptPour))s.plants[a].pour=keptPour;s.plants[a].seed=note.quality;}
 if(k==='water'&&note&&s.plants?.[a]){const prev=s.plants[a].drizzle;s.plants[a].drizzle=Number.isFinite(prev)?(prev+note.quality)/2:note.quality;}
 if(k==='harvest'&&plant&&hasGrowScore(plant)&&(s.raw?.[plant.t]||0)>rawBefore){
  const added=(s.raw[plant.t]||0)-rawBefore;
  ensureCraftQuality(s);
  s.rawQuality[plant.t]=blendQuality(s.rawQuality?.[plant.t],rawBefore,growQuality(plant),added);
 }
 const kind=k==='batch'?a?.kind:k,idx=k==='batch'?a?.index:a;
 if(kind==='make'&&Number.isFinite(s.rawQuality?.[idx])&&(s.gummies?.[idx]||0)>gummyBefore){
  const added=s.gummies[idx]-gummyBefore;
  ensureCraftQuality(s);
  s.gummyQuality[idx]=blendQuality(s.gummyQuality?.[idx],gummyBefore,s.rawQuality[idx],added);
 }
 if(kind==='pack'&&(s.packs?.[idx]||0)>packsBefore&&(note||Number.isFinite(s.gummyQuality?.[idx]))){
  const added=s.packs[idx]-packsBefore;
  ensureCraftQuality(s);
  s.packQuality[idx]=blendQuality(s.packQuality?.[idx],packsBefore,packScore(s.gummyQuality?.[idx],note?.quality),added);
  if(note?.complaint>0){const prev=s.packComplaint?.[idx];s.packComplaint[idx]=blendQuality(Number.isFinite(prev)?prev:0,packsBefore,note.complaint,added);}
 }
 if(k==='deliver'&&deal&&s.sold>soldBefore&&complaintHits(s.packComplaint?.[deal.t]||0,s.day*1000+Math.floor(s.time)+a)){
  s.relations[a]=Math.max(0,(s.relations[a]||0)-8);
  toast((CONTACTS[a]?.name||'The customer')+' found a loose seal. They still paid, and will remember it.');
 }
 if(note&&note.actionK===k)pendingCraft=null;
};
const actionOpenBench=action;
action=function(k,a,b,c){
 actionOpenBench(k,a,b,c);
 if(!benchSession||!stationTask||!BENCH_KIND[k]||stationTask.k!==k||stationTask.benchLive)return;
 if(typeof canvas?.getBoundingClientRect!=='function')return;
 stationTask.benchLive=true;
 stationView.visible=false;
 const tint=STRAINS[k==='plant'?b:(s.plants?.[a]?.t??a)]?.color||0xf2c14e;
 benchSession.open(stationTask,{color:tint});
 const hud=$('stationHUD');if(hud)hud.hidden=true;
};
window.action=action;
const renderBench=renderFrame;
renderFrame=function(){if(benchSession?.active)benchSession.applyCamera();renderBench();};
// Dev-only screenshot hook (?benchqa=1): poses the close-up bench without a station task.
if(typeof location!=='undefined'&&/[?&]benchqa=1\b/.test(location.search))window.__benchQa={pose:(k='pour',at=.45)=>{if(!benchSession)return 'no bench';benchSession.holdPose(k,at);return benchSession.kind;},close:()=>{benchSession?.close(true);return 'closed';}};

// Test-only day harness. Absent unless the URL is exactly ?qa=day. Saves go to
// gummybay-qa-day so the six story/free slots stay untouched. Boot tests strip
// the import, so the hook stays out of those runs.
if(typeof readQaFlag==='function'&&typeof qaStorageKey==='function'&&typeof createDayDirector==='function'&&typeof steerHold==='function'){
const qaKey=qaStorageKey(readQaFlag(location.search));
if(qaKey){
 const qaDirector=createDayDirector();
 const qaToasts=[];
 const qaToast=toast;toast=function(msg){qaToasts.push(String(msg).slice(0,160));if(qaToasts.length>30)qaToasts.shift();qaToast(msg);};
 save=function(){if(!active||net.role==='guest'||processingRemote)return;s.x=player.x;s.z=player.z;s.yaw=yaw;s.pitch=pitch;s.savedAt=Date.now();try{localStorage.setItem(qaKey,JSON.stringify(s));}catch(e){}};
 let qaStep=0;
 let qaGrid=null,qaGridKey='',qaGridAt=0;
 function qaRoute(x,z,tx,tz){
  // Colliders keep arriving while models stream in, so the cached grid is keyed on the collider set too.
  const key=[s.house,s.tents,(s.installed||[]).join('.'),JSON.stringify(s.layout||{}),colliders.length,colliders.filter(c=>c.furniture&&colliderEnabled(c)).length].join('|');
  if(!qaGrid||qaGridKey!==key||performance.now()-qaGridAt>20000){qaGridAt=performance.now();qaGridKey=key;const floors=new Map(),floorAt=(px,pz)=>{const k=Math.round(px*4)+','+Math.round(pz*4);let y=floors.get(k);if(y===undefined){y=floorHeight(px,pz);floors.set(k,y);}return y;};qaGrid=createWalkGrid({blocked:(px,pz)=>blocked(px,pz)||!playerHeadFits({ground:floorAt(px,pz),crouch:0,jump:0,ceiling:ceilingHeight(px,pz)}),step:(ax,az,bx,bz)=>!riseTooSteep(floorAt(ax,az),floorAt(bx,bz),false),minX:WORLD.minX,maxX:WORLD.maxX,minZ:WORLD.minZ,maxZ:WORLD.maxZ,res:.5});}
  return qaGrid.route(x,z,tx,tz,{reach:1.5});
 }
 function qaSnapshot(){
  const police=ensurePolice(),feedback=currentPoliceFeedback();
  return {route:qaRoute,routeAvoid:(x,z)=>qaGrid?.avoid(x,z,.6),active,panel:panel==='station'?'':panel,station:!!stationTask,stationKind:stationTask?.k||'',work:!!work,search:!!police.search,policeReport:!!police.report,canComply:!!feedback.canComply,
   x:player.x,z:player.z,yaw,time:s.time,day:s.day,curfew:curfewActive(s.time),cash:s.cash,xp:s.xp,level:level(),heat:s.heat,
   called:s.called,room:!!s.room,tents:s.tents,installed:!!s.installed?.includes(0),can:!!s.can,trimmers:!!s.trimmers,packStation:!!s.packStation,
   seeds:s.seeds[0]||0,soil:s.soil||0,wrappers:s.wrappers||0,water:s.water||0,plant:s.plants[0]?{phase:s.plants[0].phase,waterings:s.plants[0].waterings}:null,
   raw:s.raw[0]||0,gummies:s.gummies[0]||0,packs:s.packs[0]||0,made:s.made||0,sold:s.sold||0,harvested:s.harvested||0,listing:!!s.listing,deal:s.deals[0]?s.deals[0].npc:-1,
   thread:s.threads[0]?{status:s.threads[0].status,counter:s.threads[0].counter}:null,hired:!!s.helpers.gardener,step:qaStep,
   officers:police.officers.map(c=>({x:c.x,z:c.z,mode:c.mode})),customers:CONTACTS.map(c=>({x:c.x,z:c.z})),
   residents:CONTACTS.map((c,i)=>({name:c.name,status:residentStatus(i),x:round1(c.x),z:round1(c.z)}))};
 }
 function qaReach(goal){
  if(!goal?.action)return false;
  if(goal.action[0]==='deliver')return customerExchangeStatus(goal.action[1]).ok;
  const status=physicalActionAccess(goal.action[0],goal.action[1]);
  return status?!!status.ok:true;
 }
 function qaApply(intent){
  if(intent.close&&panel&&panel!=='station')close();
  if(intent.ripe)for(const plant of s.plants)if(plant?.phase==='growing')plant.end=Date.now()-1;
  if(intent.skipWork&&work)work.start=performance.now()-work.seconds*1000-30;
  if(intent.action)action(...intent.action);
  if(intent.press==='h')complyPolice();
  const applyHold=hold=>{if(ensurePolice().search)return;keys.w=!!hold.w;keys.a=!!hold.a;keys.s=!!hold.s;keys.d=!!hold.d;keys.shift=!!hold.shift;keys.arrowleft=!!hold.arrowleft;keys.arrowright=!!hold.arrowright;};
  applyHold(intent.hold||{});
  let left=Math.max(0,Math.min(8,intent.fast||0));
  while(left>1e-6){
   const dt=Math.min(1/60,left);left-=dt;now+=dt;
   if(intent.aim&&!stationTask&&!work&&!panel){if(intent.aim.face)yaw=Math.atan2(-(intent.aim.x-player.x),-(intent.aim.z-player.z));const steered=steerHold({yaw,x:player.x,z:player.z,tx:intent.aim.x,tz:intent.aim.z,stuck:intent.aim.stuck,arrive:intent.aim.arrive});if(steered.arrived){applyHold({});break;}applyHold(steered.hold);}
   if(stationTask){const step=MANUAL[stationTask.k]?.[stationTask.step];if(step?.[1]==='tap')stationControl(true);else stationAssist=true;updateStationInput(dt);}
   else if(!work)update(dt);
  }
  qaStep=.25+Math.max(0,Math.min(8,intent.fast||0));
 }
 const qaPlayback=frame;let qaClock=0,qaWall=null;
 frame=function(t){
  if(!active)load('story',1,true);
  const snap=qaSnapshot();
  snap.reach=qaReach(qaDirector.preview(snap));
  qaApply(qaDirector.intent(snap));
  // Slow headless frames used to replay up to a second of held keys with no
  // steering, so the bot spun and drifted. Cap the replayed time per frame.
  qaClock+=Math.min(50,Math.max(0,t-(qaWall??t)));qaWall=t;
  qaPlayback(qaClock);
  const report=qaDirector.report();
  window.__qaDay={...report,toasts:qaToasts.slice(),x:player.x,z:player.z,time:s.time,day:s.day,cash:s.cash,xp:s.xp,sold:s.sold,made:s.made,hired:!!s.helpers.gardener,curfew:curfewActive(s.time),level:level()};
 };
}
}
function round1(n){return Math.round(n*10)/10;}

// P0-3: Schedule I-style minimal HUD. A small 12-hour clock, an item hotbar
// with cash and card tiles, stacked notifications, a held phone that slides up
// (the clock keeps running while it is out) and an end-of-day card. All of it
// reads existing state; no save field is added or renamed.
var s1Notices=[],s1NoticeKey='',s1District='',s1PlaceTimer=0,s1DayStart=null,s1StateRef=null,s1SleepTimer=0;
var s1Minimap=(()=>{try{return localStorage.getItem('gummybay-hud-minimap')==='1';}catch{return false;}})();
function s1PhoneScreen(which){return Object.hasOwn(PHONE_SCREENS,which)||which==='map';}
function paintHotbarSelection(){
 document.querySelectorAll('.hotbar .slot,.hotbar .money-tile').forEach(b=>{
  const target=b.dataset.panel,tool=b.id==='equipCan'?'can':b.id==='equipPacks'?'packs':b.id==='equipBoard'?'board':'';
  const chosen=tool?equippedTool===tool:!!target&&panel===target;
  b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));
 });
}
function useHotbarSlot(key){
 const slot=hotbarSlot(key);if(!slot||!active||stationTask||placeMode)return;
 if(slot.act==='equip'){equipTool(slot.target);paintHotbarSelection();return;}
 if(slot.act==='track'){if(panel)close();trackPlace(slot.target);return;}
 if(panel===slot.target){close();return;}
 menu(slot.target);
}
function togglePhone(){if(!active||work)return;if(panel)close();else phoneHome();}
function setMinimap(on){s1Minimap=!!on;try{localStorage.setItem('gummybay-hud-minimap',on?'1':'0');}catch{}document.body.classList.toggle('show-minimap',s1Minimap);}
function showPlace(name){const el=$('placeToast');if(!el)return;el.textContent=name;el.classList?.remove('show');void el.offsetWidth;el.classList?.add('show');}
function paintNotices(){
 const t=performance.now();s1Notices=s1Notices.filter(n=>n.until>t);
 const key=s1Notices.map(n=>n.id).join('|');if(key===s1NoticeKey)return;s1NoticeKey=key;
 const box=$('notifs');if(!box)return;
 box.innerHTML=s1Notices.map(n=>'<div class="notice" data-app="'+n.app+'"><span class="notice-ico">'+(HUD_ICONS[n.app]||HUD_ICONS.message)+'</span><div><b>'+esc(n.title)+'</b><p>'+esc(n.text)+'</p></div></div>').join('');
}
function s1Snapshot(){return {day:s.day,cash:s.cash,bank:s.bank,sold:s.sold||0,xp:s.xp};}
function showSleepCard(view){const el=$('sleepCard');if(!el)return;el.innerHTML=sleepCardHTML(view,cash);el.hidden=false;clearTimeout(s1SleepTimer);s1SleepTimer=setTimeout(dismissSleepCard,12000);}
function dismissSleepCard(){const el=$('sleepCard');if(el)el.hidden=true;clearTimeout(s1SleepTimer);}
function s1MarkMoney(root){
 if(!root||typeof document.createTreeWalker!=='function')return;
 const walker=document.createTreeWalker(root,4),hits=[];
 while(walker.nextNode()){const node=walker.currentNode;if(/\$\d/.test(node.nodeValue)&&!node.parentElement?.closest?.('.money,button,input,select,label,.device-status'))hits.push(node);}
 for(const node of hits){const span=document.createElement('span');span.innerHTML=esc(node.nodeValue).replace(/(\$\d[\d,]*(?:\.\d+)?)/g,'<b class="money">$1</b>');node.replaceWith(...span.childNodes);}
}
function s1PhoneDecorate(which){
 document.body.dataset.phone=which||'';
 const modal=$('modal');if(!modal||typeof modal.querySelector!=='function')return;
 const head=modal.querySelector('.phoneheader');
 if(head&&!head.querySelector('.s1-back'))head.insertAdjacentHTML('afterbegin','<button type="button" class="s1-back" aria-label="Back to messages" onclick="menu(\'phone\')">‹</button>');
 s1MarkMoney(modal);
}
var s1PhoneMinute=-1;
function s1PhoneClock(){
 const minute=Math.floor(s.time);if(minute===s1PhoneMinute)return;s1PhoneMinute=minute;
 const c=s1Clock(s.day,s.time);
 const time=$('clockTime');if(time)time.textContent=c.clock;
 if(typeof document.querySelector!=='function')return;
 const device=document.querySelector('#overlay.phone .device-clock');if(device?.firstChild?.nodeType===3)device.firstChild.nodeValue=c.clock;
 const home=document.querySelector('#overlay.phone .phone-home-clock');if(home)home.innerHTML=c.clock.replace(/ (AM|PM)$/,'<small> $1</small>');
}
function paintS1Hud(){
 if(s1StateRef!==s){s1StateRef=s;s1DayStart=s1Snapshot();s1District='';}
 const c=s1Clock(s.day,s.time);
 const time=$('clockTime');if(time)time.textContent=c.clock;
 const day=$('clockDay');if(day)day.textContent=c.short;
 const clock=$('s1clock');if(clock){clock.hidden=!active;clock.dataset.night=String(c.night);}
 const card=$('cardSlotValue');if(card)card.textContent=cash(s.bank);
 $('cardSlot')?.classList?.toggle('paying',s.payment==='card');$('cashSlot')?.classList?.toggle('paying',s.payment!=='card');
 const counts=hotbarCounts(s,stockSummary(s));
 document.querySelectorAll('.hotbar .slot').forEach(b=>{const id=b.dataset.slot,n=counts[id]||0,em=b.querySelector('em');if(em)em.textContent=n>0&&id!=='can'?String(n):'';b.classList.toggle('empty',!n&&['can','packs','supplies','loose'].includes(id));});
 paintHotbarSelection();
 const bar=document.querySelector('.stamina');if(bar)bar.classList.toggle('full',stamina>=99.5);
 const compass=$('compass');if(compass)compass.hidden=!active||!hudMarkers().length;
 const place=$('district')?.textContent||'';if(active&&place&&place!==s1District){if(s1District)showPlace(place);s1District=place;}
 paintNotices();
}
const s1Toast=toast;toast=function(msg){s1Toast(msg);if(processingRemote)return;const kind=noticeKind(msg);s1Notices=pushNotice(s1Notices,{text:String(msg),app:kind.app,title:kind.title},performance.now());paintNotices();};
const s1UI=updateUI;updateUI=function(){s1UI();paintS1Hud();};
const s1Update=update;update=function(dt){
 s1Update(dt);
 if(!active||!panel||net.role==='guest'||!s1PhoneScreen(panel))return;
 if(ensurePolice().search)return;
 const was=curfewActive(s.time);s.time+=dt*1.2;if(s.time>=1440){s.time-=1440;s.day++;}
 const now2=curfewActive(s.time);if(now2!==was)emitGameplay({type:'curfew',active:now2,day:s.day,time:s.time});
 production(dt);
 s1PhoneClock();
};
const s1Do=doAction;doAction=function(k,a,b,c){
 const before=k==='sleep'?(s1DayStart||s1Snapshot()):null,day=s.day;
 s1Do(k,a,b,c);
 if(before&&s.day>day){showSleepCard(sleepSummary(before,s1Snapshot(),levelOf));s1DayStart=s1Snapshot();}
};
const s1Menu=menu;menu=function(which,data){
 s1Menu(which,data);
 const overlay=$('overlay');if(!overlay?.classList)return;
 const phone=s1PhoneScreen(which);
 overlay.classList.toggle('phone',phone);
 overlay.classList.toggle('landscape',phone&&['listing','contacts','map'].includes(which));
 if(phone)s1PhoneDecorate(which);else document.body.dataset.phone='';
 // Later wrappers rebuild the map screen with innerHTML+=, which wipes the canvas; repaint it last.
 if(which==='map'){const town=$('townOverview');if(town?.getContext)paintTownMap(town.getContext('2d'),town.width||560,town.height||260);}
 if(which==='settings'&&$('modal'))$('modal').innerHTML+='<h3>HUD</h3><label class="comfort-option"><input type="checkbox" '+(s1Minimap?'checked':'')+' onchange="setMinimap(this.checked)"> Show the corner minimap</label>';
};window.menu=menu;
const s1Home=phoneHome;phoneHome=function(){s1Home();const overlay=$('overlay');overlay?.classList?.remove('landscape');s1PhoneDecorate('home');};
Object.assign(window,{phoneHome,togglePhone,useHotbarSlot,setMinimap,dismissSleepCard,showSleepCard,toast});
document.body.classList.toggle('show-minimap',s1Minimap);
{const pb=$('phoneButton');if(pb)pb.innerHTML=HUD_ICONS.phone;const mb=$('menuButton');if(mb)mb.innerHTML=HUD_ICONS.menu;}
addEventListener('keydown',e=>{
 if(!active||e.repeat||e.metaKey||e.ctrlKey||e.altKey)return;
 const tag=document.activeElement?.tagName;if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
 const card=$('sleepCard');if(card&&card.hidden===false&&(e.key==='Enter'||e.key===' '||e.key==='Escape')){dismissSleepCard();return;}
 if(panel!=='customer'&&panel!=='payphone')return;
 if(!/^[1-9]$/.test(e.key))return;
 const modal=$('modal');if(typeof modal?.querySelectorAll!=='function')return;
 const choices=[...modal.querySelectorAll('button:not(.close):not([disabled])')].filter(b=>b.offsetParent!==null);
 const pick=choices[Number(e.key)-1];if(pick){e.preventDefault();pick.click();}
});
addEventListener('wheel',e=>{
 if(!active||panel||stationTask||driving||placeMode||e.target!==canvas)return;
 const options=[null];if(s.can)options.push('can');if(s.packs.some(n=>n>0))options.push('packs');
 if(options.length<2)return;
 const at=Math.max(0,options.indexOf(equippedTool)),next=options[(at+(e.deltaY>0?1:options.length-1))%options.length];
 if(next===equippedTool)return;
 if(next===null)equipTool(equippedTool);else equipTool(next);
 paintHotbarSelection();
},{passive:true});
// P1-1 · Mixing risk layer. Each save rolls its own recipe twists (seeded), unknown
// combinations read ??? until mixed, bad effects cost money, a sloppy stir can fizz a
// batch over, and every mix ends on a reveal card. Station handlers stay untouched.
const MIX_STIR_BAND=[320,1150],MIX_STIR_MAX=1800;
MANUAL.mix[1][2]=720;
let lastStir=null,mixRevealTimer=0;
function ensureMixSeed(v=s){
 if(!v)return;
 if(!Number.isSafeInteger(v.mixSeed)||v.mixSeed<=0)v.mixSeed=newMixSeed(String(v.savedAt||Date.now())+':'+(v.mode||'story'));
 v.recipeNames=v.recipeNames&&typeof v.recipeNames==='object'?v.recipeNames:{};
 if(Array.isArray(v.ingredients))while(v.ingredients.length<PANTRY.length)v.ingredients.push(0);
 if(!v.mixBook||typeof v.mixBook!=='object'){v.mixBook={};for(let i=BASE_COUNT;i<STRAINS.length;i++)if(((v.gummies?.[i]||0)+(v.packs?.[i]||0)+(v.storedPacks?.[i]||0))>0)v.mixBook[i]={day:v.day||1};}
 if(v===s&&(appliedMixSeed!==v.mixSeed||applyMixSeed.names!==JSON.stringify(v.recipeNames))){applyMixSeed(v.mixSeed,v.recipeNames);applyMixSeed.names=JSON.stringify(v.recipeNames);}
}
const mixNormalize=normalize;normalize=function(v){ensureMixSeed(v);return mixNormalize(v);};
const mixUI=updateUI;updateUI=function(){ensureMixSeed();mixUI();};
const effectName=id=>effectById(id)?.name||'???';
const chip=(id,kind='')=>'<em class="mix-chip '+(kind||(isBad(id)?'bad':''))+'">'+esc(effectName(id))+'</em>';
const ingredientSeen=i=>PANTRY[i]?.adds!=='?'&&Object.keys(s.mixBook||{}).some(k=>STRAINS[k]?.ingredient===i);
function ingredientAddsLabel(i){const f=PANTRY[i];if(!f)return '???';if(f.adds==='?')return '???';return ingredientSeen(i)?effectName(f.adds):'???';}
function servoMenuHTML(){
 ensureMixSeed();
 let html='<div class="overline">COASTWAY SERVO / OPEN 24 HOURS</div><h2>Find your next flavour.</h2><p>Fictional candy ingredients. Each one adds an effect and can rewrite one that is already there, but the price on the tin says nothing about what it is worth. A $2 jar can make a fortune or a mess. Effects stay <b>???</b> until you mix with them.</p>';
 PANTRY.forEach((f,i)=>{const locked=level()<f.unlockLevel;html+=row(esc(f.name),'<span class="mix-tag '+(f.tag==='Steady'||f.tag==='Fixer'?'calm':'risky')+'">'+esc(f.tag)+'</span> '+s.ingredients[i]+' owned · adds '+esc(ingredientAddsLabel(i))+(f.blurb?' · '+esc(f.blurb):''),locked?'LEVEL '+f.unlockLevel:cash(f.price),`action('ingredient',${i})`,locked||availableMoney()<f.price);});
 return html;
}
function mixPreviewHTML(a,b){
 ensureMixSeed();
 const base=STRAINS[a],f=PANTRY[b];if(!base||!f)return '';
 const index=mixedStrainIndex(a,b,BASE_COUNT),strain=STRAINS[index],known=!!s.mixBook?.[index];
 const risk=f.instability>=.3?'<p class="mix-warn">Risky: stir smoothly or the bowl can fizz over.</p>':'';
 if(!known)return '<div class="mix-preview unknown"><small>RESULT</small><strong>??? '+esc(base.name)+'</strong><p>'+chip('still','mystery').replace('Still','???')+chip('still','mystery').replace('Still','???')+'</p><p class="mix-price">'+cash(value(a))+' → <b>???</b></p><p class="note">Nobody has mixed '+esc(base.name)+' with '+esc(f.name.toLowerCase())+' in this save. Mix one to find out.</p>'+risk+'</div>';
 const delta=value(index)-value(a);
 return '<div class="mix-preview"><small>KNOWN RECIPE</small><strong>'+esc(strain.name)+'</strong><p>'+strain.effects.map(id=>chip(id)).join('')+'</p><p class="mix-price">'+cash(value(a))+' → <b class="'+(delta>=0?'pos':'neg')+'">'+cash(value(index))+'</b> <span class="'+(delta>=0?'pos':'neg')+'">'+(delta>=0?'+':'−')+cash(Math.abs(delta))+'</span></p>'+risk+'</div>';
}
function previewMix(){const a=Number($('mixBase')?.value),b=Number($('mixIngredient')?.value),box=$('mixPreview');if(box)box.innerHTML=mixPreviewHTML(a,b);}
function mixMenuHTML(){
 ensureMixSeed();
 const firstIngredient=Math.max(0,PANTRY.findIndex((f,i)=>level()>=f.unlockLevel&&s.ingredients[i]>0));
 let html='<div class="overline">YOUR PROPERTY / MIXING STATION</div><h2>What happens if…?</h2><p>One base gummy plus one servo ingredient. Results stay <b>???</b> until you try them, and every save mixes a little differently. Some combos are gold, some are a sticky mistake. Unwrapped gummies are used first; reserved customer stock is protected.</p><div class="form"><select id="mixBase" onchange="previewMix()">'+STRAINS.slice(0,BASE_COUNT).map((p,i)=>`<option value="${i}">${esc(p.name)} · ${s.gummies[i]+Math.max(0,s.packs[i]-reservedQty(i))} available</option>`).join('')+'</select><select id="mixIngredient" onchange="previewMix()">'+PANTRY.map((f,i)=>`<option value="${i}" ${level()<f.unlockLevel?'disabled':''} ${i===firstIngredient?'selected':''}>${esc(f.name)} · ${level()<f.unlockLevel?'level '+f.unlockLevel:s.ingredients[i]+' owned'} · adds ${esc(ingredientAddsLabel(i))}</option>`).join('')+'</select></div><div id="mixPreview">'+mixPreviewHTML(0,firstIngredient)+'</div><button class="primary" onclick="action(\'mix\',Number(document.getElementById(\'mixBase\').value),Number(document.getElementById(\'mixIngredient\').value))">Mix one gummy</button>';
 const book=Object.keys(s.mixBook||{}).map(Number).filter(i=>STRAINS[i]?.mixed).sort((x,y)=>value(y)-value(x));
 html+='<h3>Recipe book · '+book.length+' found</h3>';
 if(!book.length)html+='<p class="note">Your discovered recipes land here. Name the good ones and they show up under that name in the phone’s Products app.</p>';
 for(const i of book){const p=STRAINS[i],delta=value(i)-value(p.base),owned=(s.gummies[i]||0)+(s.packs[i]||0);
  html+='<div class="item recipe-row"><div><strong>'+esc(p.name)+'</strong><p>'+esc(STRAINS[p.base].name)+' + '+esc(PANTRY[p.ingredient].name.toLowerCase())+' · '+cash(value(i))+' <span class="'+(delta>=0?'pos':'neg')+'">('+(delta>=0?'+':'−')+cash(Math.abs(delta))+')</span> · '+owned+' in stock</p><p>'+p.effects.map(id=>chip(id)).join('')+'</p><div class="recipe-name"><input id="recipeName'+i+'" maxlength="32" placeholder="Name this recipe" value="'+esc(s.recipeNames?.[i]||'')+'"><button class="ghost" onclick="nameRecipe('+i+')">Save name</button></div></div><button class="primary" onclick="menu(\'listing\','+i+')" '+(s.packs[i]?'':'disabled')+'>List</button></div>';}
 return html;
}
function nameRecipe(i){
 if(!STRAINS[i]?.mixed||!s.mixBook?.[i])return;
 const input=$('recipeName'+i),name=String(input?.value||'').replace(/[<>]/g,'').trim().slice(0,32);
 s.recipeNames??={};if(name)s.recipeNames[i]=name;else delete s.recipeNames[i];
 ensureMixSeed();save();toast(name?'Recipe saved as '+name+' · it shows in Products':'Recipe name reset');refresh('mix');
}
// Stir rhythm: smooth circles inside the green band make a careful stir.
const stirState={speed:0,inBand:0,total:0,lastMove:0};
function stirReset(){stirState.speed=0;stirState.inBand=0;stirState.total=0;}
addEventListener('pointermove',e=>{
 if(!stationTask||stationTask.k!=='mix'||stationTask.step!==1||!stationHeld||e.isPrimary===false)return;
 const now=performance.now(),dt=Math.max(4,Math.min(80,now-(stirState.lastMove||now-16)));stirState.lastMove=now;
 const d=Math.hypot(Number(e.movementX)||0,Number(e.movementY)||0);
 stirState.speed+=(Math.min(MIX_STIR_MAX,d/dt*1000)-stirState.speed)*.18;
});
function stirQuality(){if(stirState.total<.25)return .7;return Math.max(0,Math.min(1,stirState.inBand/stirState.total));}
function paintStirMeter(){
 const needle=$('stirNeedle');if(!needle)return;
 needle.style.left=Math.min(100,stirState.speed/MIX_STIR_MAX*100)+'%';
 const read=$('stirRead');if(!read)return;
 const sp=stirState.speed,q=stirQuality();
 read.textContent=(stationHeld?(sp<MIX_STIR_BAND[0]?'Too slow · lumpy':sp>MIX_STIR_BAND[1]?'Too fast · splashing!':'Smooth · keep going'):'Hold and stir in circles')+' · '+stirLabel(q)+' '+Math.round(q*100)+'%';
}
const mixPaint=paintStation;paintStation=function(){
 const task=stationTask;
 if(task?.k==='mix'&&task.step===1&&!task.stirStarted){task.stirStarted=true;stirReset();}
 if(task?.k==='mix'&&task.step>=2&&!task.stirDone){task.stirDone=true;task.stir=stirQuality();lastStir=task.stir;}
 mixPaint();
 if(task?.k==='mix'&&task.step===1&&stationTask===task){$('stationHUD').insertAdjacentHTML('beforeend','<div class="stir-meter" aria-label="Stir speed"><span class="stir-zone" style="left:'+(MIX_STIR_BAND[0]/MIX_STIR_MAX*100)+'%;width:'+((MIX_STIR_BAND[1]-MIX_STIR_BAND[0])/MIX_STIR_MAX*100)+'%"></span><i id="stirNeedle"></i></div><p id="stirRead" class="stir-read"></p>');paintStirMeter();}
 if(task?.k==='mix'&&task.step===2&&stationTask===task)$('stationHUD').insertAdjacentHTML('beforeend','<p class="stir-read">Stir: <b>'+stirLabel(task.stir)+'</b> '+Math.round(task.stir*100)+'%</p>');
};
const mixUpdate=update;update=function(dt){
 mixUpdate(dt);
 const task=stationTask;
 if(!task||task.k!=='mix'||task.step!==1)return;
 const step=Math.min(.06,dt||0);
 if(stationAssist){stirState.speed+=(700-stirState.speed)*.2;}
 else if(!stationHeld||performance.now()-stirState.lastMove>90)stirState.speed*=Math.max(0,1-step*5);
 if(stationHeld||stationAssist){stirState.total+=step;if(stirState.speed>=MIX_STIR_BAND[0]&&stirState.speed<=MIX_STIR_BAND[1])stirState.inBand+=step;}
 paintStirMeter();
};
function showMixReveal(card){
 if(processingRemote||typeof document.createElement!=='function')return;
 let box=$('mixReveal');
 if(!box){box=document.createElement('div');box.id='mixReveal';box.setAttribute('role','status');box.setAttribute('aria-live','polite');document.body.appendChild(box);}
 const gained=card.gained.map(id=>'<li class="'+(isBad(id)?'bad':'gain')+'">+ '+esc(effectName(id))+'</li>').join(''),lost=card.lost.map(id=>'<li class="lost">'+esc(effectName(id))+'</li>').join(''),kept=card.kept.map(id=>'<li>'+esc(effectName(id))+'</li>').join('');
 const pos=card.delta>=0;
 box.innerHTML='<div class="mix-card'+(card.stir.kind==='fizz'?' fizz':card.stir.kind==='perfect'?' perfect':'')+'" onclick="dismissMixReveal()"><small>MIX RESULT · '+esc(card.stir.label.toUpperCase())+' STIR</small>'+(card.fresh?'<div class="mix-new">New recipe discovered! <b>+'+card.xp+' XP</b></div>':'')+'<h2>'+esc(card.name)+'</h2><p class="mix-sub">'+esc(card.baseName)+' + '+esc(card.ingredient)+(card.count>1?' · batch of '+card.count:'')+'</p><ul class="mix-effects">'+kept+gained+lost+'</ul><div class="mix-swing"><span>'+cash(card.basePrice)+'</span><i>→</i><strong class="'+(pos?'pos':'neg')+'">'+cash(card.price)+'</strong><em class="'+(pos?'pos':'neg')+'">'+(pos?'+':'−')+cash(Math.abs(card.delta))+'</em></div>'+(card.twist?'<p class="mix-twist">'+esc(card.twist)+'</p>':'')+(card.stir.kind==='fizz'?'<p class="mix-fizz">It fizzed over! '+card.stir.lost+' gumm'+(card.stir.lost===1?'y':'ies')+' lost to a sticky volcano.</p>':card.stir.kind==='perfect'?'<p class="mix-perfect">Perfect fold! One extra gummy from the bowl.</p>':'')+card.notes.map(n=>'<p class="mix-note">'+esc(n)+'</p>').join('')+'<p class="mix-hint">'+(card.fresh?'Name it in the recipe book at the mixing station. ':'')+'Click or press Enter</p></div>';
 box.hidden=false;box.classList.remove('show');void box.offsetWidth;box.classList.add('show');
 clearTimeout(mixRevealTimer);mixRevealTimer=setTimeout(dismissMixReveal,card.fresh?11000:7000);
}
function dismissMixReveal(){const box=$('mixReveal');if(box){box.hidden=true;box.classList.remove('show');}clearTimeout(mixRevealTimer);}
addEventListener('keydown',e=>{const box=$('mixReveal');if(box&&box.hidden===false&&(e.key==='Enter'||e.key==='Escape')&&!stationTask){dismissMixReveal();}});
function twistLine(strain){const t=strain.twist;if(!t)return '';if(t.kind==='lucky')return 'Lucky batch: this save’s recipe picked up '+effectName(t.effect)+' as a bonus.';if(t.kind==='side')return 'Side effect: '+effectName(t.effect)+' crept in. Every save mixes a little differently.';return 'Odd reaction: '+effectName(t.from)+' turned into '+effectName(t.effect)+'.';}
const mixRiskAction=doAction;doAction=function(k,a,b,c){
 ensureMixSeed();
 if(k==='ingredient'&&PANTRY[a]&&level()<PANTRY[a].unlockLevel){toast(PANTRY[a].name+' unlocks at level '+PANTRY[a].unlockLevel+'.');return;}
 const req=k==='mix'?{index:a,ingredient:b??0,count:1}:k==='batch'&&a?.kind==='mix'?{index:a.index,ingredient:a.ingredient??0,count:a.count||1}:null;
 if(req&&PANTRY[req.ingredient]&&level()<PANTRY[req.ingredient].unlockLevel){toast(PANTRY[req.ingredient].name+' unlocks at level '+PANTRY[req.ingredient].unlockLevel+'.');return;}
 const target=req?mixedStrainIndex(req.index,req.ingredient,BASE_COUNT):-1,mixedBefore=s.mixed,xpBefore=s.xp,fresh=target>=0&&!s.mixBook?.[target];
 const deal=k==='deliver'?s.deals.find(d=>d.npc===a):null,soldBefore=s.sold,cashBefore=s.cash;
 mixRiskAction(k,a,b,c);
 if(req&&target>=0&&s.mixed>mixedBefore&&STRAINS[target]){
  const made=s.mixed-mixedBefore,strain=STRAINS[target],item=PANTRY[req.ingredient],stir=Number.isFinite(lastStir)?lastStir:.6;lastStir=null;
  const roll=stirOutcome({seed:s.mixSeed,key:strain.recipeKey,ingredient:item.id,stir,count:made,nonce:s.mixed,item,effects:strain.effects});
  if(roll.lost)s.gummies[target]=Math.max(0,(s.gummies[target]||0)-roll.lost);
  if(roll.bonus)s.gummies[target]=(s.gummies[target]||0)+roll.bonus;
  s.mixBook[target]??={day:s.day,stir:Math.round(stir*100)};
  const base=STRAINS[strain.base],sum=revealSummary(base.effects,strain.effects,base.price);
  const notes=[];if(strain.effects.includes('pungent'))notes.push('Pungent: selling this adds heat. Cops can smell it.');if(strain.effects.includes('luminous'))notes.push('Luminous: glowing customers draw patrols after dark.');if(strain.effects.includes('volatile'))notes.push('Volatile: this recipe fizzes over more easily. Stir gently.');
  save();
  if(roll.kind==='fizz'){playTone(150,.35,.05);toast('Fizz-over! Lost '+roll.lost+' '+strain.name+'.');}else if(fresh)playTone(880,.18,.03);
  showMixReveal({fresh,xp:Math.max(0,s.xp-xpBefore),name:strain.name,baseName:base.name,ingredient:item.name.toLowerCase(),count:made,kept:strain.effects.filter(id=>!sum.gained.includes(id)),gained:sum.gained,lost:sum.lost,basePrice:value(strain.base),price:value(target),delta:value(target)-value(strain.base),stir:roll,twist:fresh?twistLine(strain):'',notes});
 }
 if(deal&&s.sold>soldBefore&&STRAINS[deal.t]){
  const night=s.time<360||s.time>=1200,effects=STRAINS[deal.t].effects||[],out=saleConsequences(effects,{night});
  if(out.heat)s.heat=Math.min(100,s.heat+out.heat);
  if(out.forgetPay&&Math.random()<out.forgetPay){const short=Math.round((s.cash-cashBefore)*.1);if(short>0){s.cash-=short;s.earned-=short;out.notes.push('Scattered: your customer wandered off '+cash(short)+' short.');}}
  for(const n of out.notes)toast(n);
  if(out.heat||out.notes.length)save();
 }
};
const mixProductRows=phoneProductRows;phoneProductRows=function(){
 ensureMixSeed();
 const rows=mixProductRows(),seen=new Set(rows.map(r=>r.index));
 for(const r of rows){const item=STRAINS[r.index];if(item?.mixed){r.effects=item.effects.map(effectName);r.recipe='Mix '+STRAINS[item.base].name+' with '+PANTRY[item.ingredient].name.toLowerCase()+'. '+item.effects.map(effectName).join(', ')+'.';}}
 for(const k of Object.keys(s.mixBook||{})){const i=Number(k),item=STRAINS[i];if(!item?.mixed||seen.has(i)||!s.recipeNames?.[i])continue;
  rows.push({index:i,name:item.name,swatch:phoneSwatch(item.color),effects:item.effects.map(effectName),market:value(i),price:value(i),qty:1,packed:0,listed:false,recipe:'Saved recipe: mix '+STRAINS[item.base].name+' with '+PANTRY[item.ingredient].name.toLowerCase()+'.'});}
 return rows;
};
Object.assign(window,{previewMix,nameRecipe,dismissMixReveal});
// Dev-only screenshot hook (?mixqa=1): stocks a save and runs a mix with a chosen stir, skipping the walk.
if(typeof location!=="undefined"&&/[?&]mixqa=1\b/.test(location.search))window.__mixQa={setup(xp=200,cashAmount=2000){if(!s)return 'no save';s.room=s.room||true;s.xp=Math.max(s.xp,xp);s.cash=Math.max(s.cash,cashAmount);for(let i=0;i<BASE_COUNT;i++)s.gummies[i]=Math.max(s.gummies[i]||0,6);s.ingredients=PANTRY.map(()=>6);save();updateUI();return level();},mix(base,ing,stir=.95){s.mixer=s.mixer||true;lastStir=stir;const keep=physicalActionAccess;physicalActionAccess=()=>null;try{doAction('mix',base,ing);}finally{physicalActionAccess=keep;}return s.mixed;},station(base,ing){s.mixer=s.mixer||true;const at=points.find(p=>p.type==='mix'&&pointVisible(p));if(at){player.x=at.x+.6;player.z=at.z+.6;}const keep=physicalActionAccess;physicalActionAccess=()=>null;try{action('mix',base,ing);}finally{physicalActionAccess=keep;}if(stationTask){stationTask.step=1;stationTask.progress=.45;paintStation();}return !!stationTask;},state:()=>({level:level(),seed:s?.mixSeed,book:Object.keys(s?.mixBook||{}).length})};
// Sugar Squad. The old 4s stop / 18s pursuit loop still runs for officers who
// are not on a chase, so the day harness and the search tests keep their timing.
let squadCast=null,squadDizzy=null,squadAwake=false,squadPressure=0,hideWas='',bustPlaying=null,netSlowUntil=0,netMash=0;
const squadHits=new Map(),squadWitnesses=[];
function squadQaDay(){try{return new URLSearchParams(location.search).get('qa')==='day';}catch{return false;}}
function squadLive(){return active&&!squadQaDay()&&!firstSaleProtected(s)&&!warnedToday();}
// Set by the skateboard block: a fast board counts as bolting from a squad officer.
let skateBolting=()=>false;
// After a first-day warning the patrol leaves you alone for the rest of that day.
function warnedToday(){const p=s?.police;return !!p&&p.warnedDay===s.day&&penaltyTier(s.day)==='warning';}
const warnedTick=tickPolice;tickPolice=function(dt){warnedTick(dt);if(!warnedToday())return;const p=ensurePolice();if(p.search)return;for(const c of p.officers){if(!c.squad&&(c.mode==='stop'||c.mode==='pursuit')){c.mode='patrol';c.target=null;c.suspicion=0;c.lost=0;}}};
function ensureChase(p){if(!p.chase||typeof p.chase.stage!=='string')p.chase=freshChase();return p.chase;}
function clearSquad(p,note){
 const police=p||ensurePolice();
 police.chase=freshChase();
 squadPressure=0;
 for(const cop of police.officers){if(!cop.squad)continue;cop.mode='patrol';cop.target=null;cop.suspicion=0;cop.lost=0;cop.grab=0;cop.squad='';}
 if(note)toast(note);
}
// An officer standing on top of you always counts: the cone's pitch test failed at arm's length.
function copSeesPlayer(cop){if((cop.ko||0)<=0&&Math.hypot(cop.x-player.x,cop.z-player.z)<1.2)return true;return inVision({x:cop.x,y:1.55,z:cop.z,angle:cop.angle},{x:player.x,y:player.y||1.2,z:player.z},{sight:(a,b)=>copSight(a,b)}).seen;}
function squadWakeFrom(event){
 if(!squadLive())return;
 const key=event?.key?.toLowerCase?.()||'';
 if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)||event?.target?.dataset?.key)squadAwake=true;
}
function maybeEngageSquad(p){
 if(!squadLive()||!squadAwake||p.search||p.cooldown>0)return;
 const chase=p.chase;
 if(chase&&chase.stage&&chase.stage!=='clear')return;
 let best=null,bestD=Infinity;
 p.officers.forEach((cop,index)=>{
  if(cop.squad||cop.mode!=='patrol'||(cop.ko||0)>0)return;
  const seen=inVision({x:cop.x,y:1.55,z:cop.z,angle:cop.angle},{x:player.x,y:1.2,z:player.z},{sight:(a,b)=>copSight(a,b)});
  if(!seen.seen||seen.distance>=bestD)return;
  best=index;bestD=seen.distance;
 });
 if(best==null)return;
 const cop=p.officers[best];
 const stage=curfewActive(s.time)?'investigating':'suspicious';
 p.chase=spotChase(freshChase(),stage);
 cop.squad=p.chase.stage;cop.target=localPoliceRole();cop.grab=0;cop.lost=0;cop.suspicion=70;cop.mode='patrol';
 toast(stage==='investigating'?'Curfew. A Sugar Squad officer is looking into you.':'A Sugar Squad officer is suspicious.');
}
function joinBackup(p,lead){
 const stage=p.chase?.stage;
 if(stage!=='pursuit'&&stage!=='all-units'||p.chase.backup)return;
 p.chase.backup=true;
 for(const other of p.officers){
  if(other===lead||other.squad||other.mode!=='patrol')continue;
  if(Math.hypot(other.x-lead.x,other.z-lead.z)>85)continue;
  other.squad=stage;other.target=localPoliceRole();other.grab=0;other.lost=0;other.mode='pursuit';
 }
}
function stepSquadOfficer(cop,i,dt,p){
 const chase=ensureChase(p);
 if(chase.stage==='clear'){cop.squad='';cop.mode='patrol';cop.target=null;cop.suspicion=0;cop.grab=0;return;}
 if((cop.ko||0)>0){cop.ko=Math.max(0,cop.ko-dt);cop.mode='patrol';return;}
 const seen=copSeesPlayer(cop);
 if(!p._squadStepped){
  p._squadStepped=true;
  const wasDistracted=(chase.distracted||0)>0;
  const distracted=Math.max(0,(chase.distracted||0)-dt);
  const stepped=stepChase(chase,dt,seen&&!wasDistracted);
  p.chase={...stepped,distracted,backup:chase.backup===true};
  if(seen&&!wasDistracted&&((keys.shift&&(keys.w||keys.arrowup))||skateBolting())){
   squadPressure+=dt;
   if(squadPressure>3&&p.chase.stage!=='clear'){p.chase=escalateChase(p.chase);p.chase.backup=false;squadPressure=0;toast('You bolted. The squad steps it up.');}
  }else if(!seen)squadPressure=Math.max(0,squadPressure-dt);
  if(p.chase.stage==='clear'){clearSquad(p,'They lost you.');return;}
 }
 if(p.chase.stage==='clear'||!cop.squad)return;
 const stage=p.chase.stage;
 cop.squad=stage;
 if(stage==='pursuit'||stage==='all-units')cop.mode='pursuit';
 else{cop.mode='patrol';cop.suspicion=70;cop.lost=0;}
 joinBackup(p,cop);
 if((p.chase.distracted||0)>0)return;
 const speed=(cop.slowUntil>now?0.45:1)*({suspicious:3.4,investigating:5.4,pursuit:8.2,'all-units':8.6}[stage]||4);
 moveCop(cop,i,{x:player.x,z:player.z},speed,dt);
 const distance=Math.hypot(cop.x-player.x,cop.z-player.z);
 if((stage==='pursuit'||stage==='all-units')&&distance<5.5&&netSlowUntil<=now&&Math.random()<dt*0.35){netSlowUntil=now+3;netMash=0;toast('Sticky net. Mash E to tear it off.');}
 if(distance<2.6&&seen&&!driving&&(cop.slowUntil||0)<=now){
  cop.grab=(cop.grab||0)+dt;
  if(cop.grab>1.75){
   cop.grab=0;
   if(stage==='pursuit'||stage==='all-units')performBust();
   else beginPoliceSearch(localPoliceRole(),false);
  }
 }else cop.grab=0;
}
function squadWakeSpot(){
 const origin={x:6,z:4};
 if(!blocked(origin.x,origin.z))return origin;
 for(let ring=1;ring<=8;ring++)for(let step=0;step<8;step++){
  const x=origin.x+Math.cos(step*Math.PI/4)*ring*1.6,z=origin.z+Math.sin(step*Math.PI/4)*ring*1.6;
  if(!blocked(x,z))return {x,z};
 }
 return {x:player.x,z:player.z};
}
function showBustDom(sample){
 let root=document.getElementById('bustedCut');
 if(!root&&document.createElement){
  root=document.createElement('div');
  root.id='bustedCut';
  if(typeof root.innerHTML==='string')root.innerHTML='<div class="bust-bar top"></div><div class="bust-bar bottom"></div><div class="bust-flash"></div><canvas class="bust-mug" width="160" height="200"></canvas><strong class="bust-stamp"></strong><p class="bust-note"></p>';
  document.body?.appendChild?.(root);
  try{paintMugshot(root.querySelector?.('canvas'),(s.day||1)*17+Math.round(s.cash||0));}catch{}
 }
 if(!root)return;
 root.hidden=false;
 root.style?.setProperty?.('--bust-bar',Math.round((sample?.letterbox||0)*100)+'%');
 const flash=root.querySelector?.('.bust-flash');if(flash)flash.style.opacity=String(Math.max(0,Math.min(1,sample?.flash||0)));
 const stamp=root.querySelector?.('.bust-stamp');if(stamp)stamp.textContent=sample?.text||'';
 const note=root.querySelector?.('.bust-note');
 if(note&&bustPlaying)note.textContent=(bustPlaying.fine?cash(bustPlaying.fine)+' fine · carried gummies confiscated · ':'')+'wake 07:00';
}
function hideBustDom(){const root=document.getElementById('bustedCut');if(root)root.hidden=true;}
function tickBust(dt){
 if(!bustPlaying)return;
 bustPlaying.t+=dt;
 const sample=bustedSample(bustPlaying.scene,bustPlaying.t);
 showBustDom(sample);
 if(bustPlaying.t>=bustPlaying.scene.duration){bustPlaying=null;hideBustDom();}
}
function performBust(){
 if(bustPlaying||net.role==='guest')return;
 const p=ensurePolice();
 // Day 1 is protected: a caught chase ends in a warning, with no fine, seizure or lost night.
 if(penaltyTier(s.day)==='warning'){p.cooldown=50;p.warnedDay=s.day;p.search=null;p.report={seized:0,fine:0,role:localPoliceRole(),day:s.day,time:s.time,fled:true,tier:'warning'};s.heat=Math.min(s.heat,15);clearSquad(p);save();toast(penaltyMessage({tier:'warning',seized:0,fine:0},cash));return;}
 const result=applyBust({cash:s.cash,bank:s.bank,day:s.day,time:s.time,heat:s.heat,raw:s.raw,gummies:s.gummies,packs:s.packs,storedPacks:s.storedPacks});
 const kept=searchPenalty({day:s.day,cash:s.cash,raw:s.raw,gummies:s.gummies,packs:s.packs,fled:true});
 result.fine=kept.fine;result.seized=kept.seized;
 s.cash=Math.max(0,s.cash-kept.fine);s.day=result.state.day;s.time=result.state.time;s.heat=result.state.heat;
 s.raw=kept.raw;s.gummies=kept.gummies;s.packs=kept.packs;
 if(result.seized){for(const deal of s.deals){if(s.threads[deal.npc]&&(s.packs[deal.t]||0)<deal.qty){s.threads[deal.npc].status='cancelled';s.threads[deal.npc].messages.push({mine:false,text:'Your delivery was cancelled after the police seized the stock.'});}}s.deals=s.deals.filter(deal=>(s.packs[deal.t]||0)>=deal.qty);if(s.listing&&!(s.packs[s.listing.t]>0))s.listing=null;}
 p.arrests=(p.arrests||0)+1;p.cooldown=50;p.search=null;
 p.report={seized:result.seized,fine:result.fine,role:localPoliceRole(),day:s.day,time:s.time,fled:true};
 clearSquad(p);
 const spot=squadWakeSpot();player.x=spot.x;player.z=spot.z;
 try{syncPlayerView();}catch{}
 bustPlaying={scene:bustedTimeline(),t:0,fine:result.fine,seized:result.seized};
 showBustDom(bustedSample(bustPlaying.scene,0));
 save();
}
function squadSeen(){return ensurePolice().officers.some(cop=>cop.squad&&(cop.ko||0)<=0&&copSeesPlayer(cop));}
function tickHide(){
 const spot=hideSpotAt(player.x,player.z);
 const id=spot?.id||'';
 if(id&&id!==hideWas){
  const p=ensurePolice();
  const result=hidingClears(p.chase||freshChase(),{inside:true,seen:squadSeen()});
  if(result.cleared)clearSquad(p,'You slip into the '+spot.label.toLowerCase()+'. They walk on.');
  else if(p.chase&&p.chase.stage!=='clear'&&squadSeen())toast('They saw you duck into the '+spot.label.toLowerCase()+'.');
 }
 hideWas=id;
}
function tickWitnesses(dt){
 if(!squadWitnesses.length)return;
 const p=ensurePolice();
 for(let i=squadWitnesses.length-1;i>=0;i--){
  const next=stepWitness(squadWitnesses[i],dt,{crime:true});
  if(!next.called){squadWitnesses[i]=next;continue;}
  squadWitnesses.splice(i,1);
  if(!squadLive()&&!(p.chase&&p.chase.stage!=='clear'))continue;
  if(!p.chase||p.chase.stage==='clear')p.chase=spotChase(freshChase(),curfewActive(s.time)?'investigating':'suspicious');
  p.chase=escalateChase(p.chase);
  const lead=p.officers.find(cop=>cop.squad)||p.officers.find(cop=>cop.mode==='patrol');
  if(lead){lead.squad=p.chase.stage;lead.target=localPoliceRole();if(p.chase.stage==='pursuit'||p.chase.stage==='all-units')lead.mode='pursuit';}
  toast('Someone phoned the Sugar Squad.');
 }
}
function nearestWitness(){
 const crowd=streetCrowd?.people||[];
 let best=null,bestD=12;
 crowd.forEach((person,index)=>{const distance=Math.hypot(person.x-player.x,person.z-player.z);if(distance<bestD){best=index;bestD=distance;}});
 return best;
}
function noteWitness(){
 if(!streetCrowd?.people)return;
 if(squadWitnesses.some(item=>item.state==='calling'))return;
 const who=nearestWitness();
 if(who==null)return;
 streetCrowd.people[who].callUntil=now+4;
 squadWitnesses.push({state:'calling',left:4,called:false});
}
function markDizzy(x,z,style,seconds){squadDizzy={x,y:terrainHeight(x,z)+1.2,z,style:style||'stars',until:now+Math.max(0.45,seconds||0.6)};}
function squadTool(){const id=s.squadTool&&s.gear?.includes(s.squadTool)?s.squadTool:'shove';return scuffleWeapon(id);}
function faceDot(x,z){const dx=x-player.x,dz=z-player.z,distance=Math.hypot(dx,dz)||1;return (Math.sin(yaw)*dx+Math.cos(yaw)*dz)/distance;}
function bonkTarget(){
 const weapon=squadTool(),range=weapon.range||1.2;
 let best=null,bestD=range;
 const consider=(kind,index,x,z,extra)=>{
  const distance=Math.hypot(x-player.x,z-player.z);
  if(distance>range||faceDot(x,z)<0.2||distance>=bestD)return;
  best={kind,index,x,z,distance,...extra};bestD=distance;
 };
 (streetCrowd?.people||[]).forEach((person,index)=>consider('crowd',index,person.x,person.z));
 ensurePolice().officers.forEach((cop,index)=>consider('cop',index,cop.x,cop.z,{cop}));
 CONTACTS.forEach((person,index)=>consider('npc',index,person.x,person.z));
 return best;
}
function doBonk(){
 if(!active||panel||work||driving||bustPlaying)return;
 if(ensurePolice().search)return;
 const weapon=squadTool();
 if(weapon.id!=='shove'&&!(s.gear||[]).includes(weapon.id)){toast('That is not in your bag.');return;}
 const target=bonkTarget();
 if(!target){toast('Nobody close enough.');return;}
 const key=target.kind+':'+target.index;
 const hit=bonk(squadHits.get(key)||freshTarget(),weapon,Math.random());
 squadHits.set(key,hit.target);
 playTone(weapon.id==='pan'?140:220,.12,.04);
 if(hit.kind==='net'){
  if(target.cop){target.cop.slowUntil=now+(weapon.slowFor||3);toast('The net sticks. They slow down.');}
  else toast('The net sticks.');
  return;
 }
 if(hit.ko)markDizzy(target.x,target.z,hit.style,hit.down);
 else markDizzy(target.x,target.z,'stars',0.55);
 if(target.kind==='crowd'){
  if(hit.ko){streetCrowd.knock(target.index,hit.down,now);streetCrowd.people[target.index].koStyle=hit.style;}
  noteWitness();
  if(hit.ko)toast('They sit down dizzy for a few seconds.');
 }
 if(target.kind==='npc'&&hit.ko)toast(CONTACTS[target.index].name+' sits down seeing '+(hit.style==='birdies'?'birdies':'stars')+'.');
 if(target.kind==='cop'&&target.cop){
  s.heat=Math.min(100,(s.heat||0)+COP_HEAT);
  target.cop.ko=hit.ko?hit.down:0.8;
  const p=ensurePolice();
  if(squadLive()||(p.chase&&p.chase.stage&&p.chase.stage!=='clear')){
   if(!p.chase||p.chase.stage==='clear')p.chase=spotChase(freshChase(),'suspicious');
   p.chase=escalateChase(p.chase);p.chase.backup=false;
   target.cop.squad=p.chase.stage;target.cop.target=localPoliceRole();
   target.cop.mode=p.chase.stage==='pursuit'||p.chase.stage==='all-units'?'pursuit':'patrol';
  }
  markDizzy(target.cop.x,target.cop.z,hit.ko?hit.style:'stars',target.cop.ko);
  toast(hit.ko?'The officer sits down dizzy. Heat is up.':'The officer felt that. Heat is up.');
 }
}
function cycleSquadTool(){
 const gear=(s.gear&&s.gear.length)?s.gear:['shove'];
 const at=Math.max(0,gear.indexOf(s.squadTool));
 s.squadTool=gear[(at+1)%gear.length];
 toast(scuffleWeapon(s.squadTool).name);
}
function tryDonut(){
 const p=ensurePolice();
 const result=donutBribe(p.chase||freshChase(),s.donuts||0);
 if(!result.ok){toast(result.reason==='stage'?'A donut only works while they are merely suspicious.':'You have no donuts. Buy one at Shady Seconds.');return;}
 s.donuts=result.donuts;p.chase={...result.chase,backup:p.chase?.backup===true};save();
 toast('They take the donut. Ten seconds to slip away.');
}
function tryCashBribe(){
 const p=ensurePolice();
 const result=cashBribe(p.chase||freshChase(),s.cash,Math.random());
 if(!result.ok){toast(result.reason==='short'?'Not enough cash in hand.':result.reason==='stage'?'Nobody is close enough to offer.':'They wave the cash off.');return;}
 s.cash=result.cash;clearSquad(p,'They look the other way.');save();
}
function buyGear(id){
 const item=scuffleWeapon(id);
 if(!item||!item.shop)return;
 if(s.gear.includes(item.id)){toast('You already have the '+item.name.toLowerCase()+'.');return;}
 if(!spend(item.price))return;
 s.gear.push(item.id);s.squadTool=item.id;save();toast(item.name+' is yours. Z cycles what you are holding.');menu('shady');
}
function buyDonut(){
 if((s.donuts||0)>=99){toast('Your bag is full of donuts.');return;}
 if(!spend(DONUT_PRICE))return;
 s.donuts=(s.donuts||0)+1;save();toast('A donut. Press N when an officer is only suspicious.');menu('shady');
}
function takePan(){
 if(s.foundPan||s.gear.includes('pan')){toast('The pan is already in your bag.');close();return;}
 if(Math.hypot(player.x-SQUAD_PAN.x,player.z-SQUAD_PAN.z)>3.2){toast('Walk up to the pan.');return;}
 s.foundPan=true;if(!s.gear.includes('pan'))s.gear.push('pan');s.squadTool='pan';save();
 toast('A dented frying pan. Three bonks and they sit down dizzy.');close();
}
function tryPocketSlip(){
 const q=ensurePolice().search;
 if(!q||q.role!==localPoliceRole()||q.spared)return;
 const time=4-(q.remaining||0);
 let zone=-1;
 for(let i=0;i<SLIP_ZONES;i++)if(slipZoneOpen(time,i))zone=i;
 const result=trySlip({time,zone,skill:Math.min(1,(s.sold||0)/8),roll:Math.random()});
 if(!result.ok){toast(result.reason==='window'?'Wrong moment. Watch the pocket bar.':'They felt that pocket.');return;}
 const spare=spareStack(s,zone<0?0:zone);
 if(!spare){toast('Your pockets are empty.');return;}
 q.spared=spare;
 toast('One stack stays in the pocket.');
}
function paintSlip(){
 let bar=document.getElementById('slipBar');
 const q=s.police?.search;
 const show=!!(q&&q.role===localPoliceRole()&&active);
 if(!show){if(bar)bar.hidden=true;return;}
 if(!bar){bar=document.createElement('div');bar.id='slipBar';bar.innerHTML='<span></span><span></span><span></span><span></span><em>SPACE slips one stack</em>';document.body.appendChild(bar);}
 bar.hidden=false;
 const time=4-(q.remaining||0);
 if(typeof bar.querySelectorAll!=='function')return;
 [...bar.querySelectorAll('span')].forEach((node,index)=>node.classList?.toggle('open',slipZoneOpen(time,index)));
}
function syncSquadCast(){
 if(!squadCast){try{squadCast=createSquadCast({THREE,scene,capacity:Math.max(10,officers.length)});}catch(error){console.warn('Sugar Squad cast skipped',error);squadCast={update(){}};return;}}
 const chase=s.police?.chase;
 const dizzy=squadDizzy&&squadDizzy.until>now?{...squadDizzy,panTaken:!!s.foundPan}:{panTaken:!!s.foundPan};
 squadCast.update({officers:s.police?.officers||[],now,floor:(x,z)=>terrainHeight(x,z),showCone:!!(chase&&(chase.stage==='suspicious'||chase.stage==='investigating')),dizzy,legacy:[]});
}
const squadMenu=menu;menu=function(which,data){
 squadMenu(which,data);
 if(which==='journal'&&$('modal'))$('modal').innerHTML+='<p>The Sugar Squad can lose you. Break their line of sight and the search timer runs out, or step into a dumpster, a porta-loo or a hedge while they cannot see you. A donut (N) buys ten seconds when they are only suspicious. A cash offer (U) is a coin toss and never touches the bank. They will not stop you before your first sale. Curfew stays 21:00 to 05:00. Q bonks with whatever you are holding (Z to cycle): a shove, a foam baton, a frying pan, a slingshot or a sticky net. Shady Seconds sells them. A pan is also lying around town.</p>';
 if(which==='shady'&&$('modal')){
  const rows=shopWeapons().map(item=>'<div class="item"><div><strong>'+esc(item.name)+'</strong><p>'+(s.gear.includes(item.id)?'In your bag.':'Cartoon bonk · '+cash(item.price))+'</p></div><button class="primary" '+(s.gear.includes(item.id)?'disabled':'')+' onclick="buyGear(\''+item.id+'\')">'+(s.gear.includes(item.id)?'OWNED':cash(item.price))+'</button></div>').join('');
  $('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Close">×</button><div class="overline">SHADY SECONDS</div><h2>Nothing sharp.</h2><p>Foam, a pan, a slingshot, a sticky net. Three bonks and they sit down seeing stars. Donuts distract a suspicious officer.</p>'+rows+'<div class="item"><div><strong>Donut</strong><p>You are holding '+(s.donuts||0)+'.</p></div><button class="primary" onclick="buyDonut()">'+cash(DONUT_PRICE)+'</button></div>';
 }
 if(which==='pan')takePan();
};window.menu=menu;
Object.assign(window,{buyGear,buyDonut,takePan});
addPoint('shady',SQUAD_SHOP.label,SQUAD_SHOP.x,SQUAD_SHOP.z+1.2);
addPoint('pan',SQUAD_PAN.label,SQUAD_PAN.x,SQUAD_PAN.z);
addEventListener('keydown',event=>{squadWakeFrom(event);},{capture:true});
addEventListener('pointerdown',event=>{squadWakeFrom(event);},{capture:true});
addEventListener('keydown',event=>{
 if(!active||event.repeat||event.metaKey||event.ctrlKey||event.altKey)return;
 const tag=document.activeElement?.tagName;
 if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
 const key=event.key.toLowerCase();
 if(netSlowUntil>now&&key==='e'){netMash++;if(netMash>=4){netSlowUntil=0;netMash=0;toast('You tear the net off.');}event.preventDefault();event.stopImmediatePropagation();return;}
 if(bustPlaying&&(key===' '||key==='enter'||key==='escape')){bustPlaying.t=bustPlaying.scene.duration;tickBust(0);event.preventDefault();event.stopImmediatePropagation();return;}
 if(key===' '&&ensurePolice().search){tryPocketSlip();event.preventDefault();return;}
 if(panel||work)return;
 if(key==='q'){event.preventDefault();doBonk();}
 else if(key==='z')cycleSquadTool();
 else if(key==='n')tryDonut();
 else if(key==='u')tryCashBribe();
},true);
const squadPaint=paintHudReadout;paintHudReadout=function(){
 squadPaint();
 const chase=s.police?.chase;
 if(!chase||chase.stage==='clear'||bustPlaying||!$('wantedBanner'))return;
 const banner=policeBanner({stage:chase.stage,searchRemaining:chase.searching?chase.left:null,duration:stageSeconds(chase.stage)||4,heat:s.heat,armed:false});
 const plate=$('wantedBanner');
 plate.hidden=!active||!banner.visible;plate.dataset.state=banner.id;
 if($('wantedLabel'))$('wantedLabel').textContent=banner.label;
 const bar=$('searchCountdown'),fill=$('searchFill');
 if(bar)bar.hidden=banner.countdown===null;
 if(fill&&banner.countdown!==null)fill.style.width=Math.round(banner.countdown*100)+'%';
};
const squadUpdate=update;update=function(dt){
 if(bustPlaying){keys={};locomotion.x=locomotion.z=0;}
 const x0=player.x,z0=player.z;
 squadUpdate(dt);
 if(!active)return;
 paintSlip();
 if(bustPlaying)tickBust(dt);
 if(net.role==='guest')return;
 tickHide();
 tickWitnesses(dt);
 if(squadDizzy&&squadDizzy.until<=now)squadDizzy=null;
 if(netSlowUntil>now){player.x=x0+(player.x-x0)*0.4;player.z=z0+(player.z-z0)*0.4;locomotion.x*=0.4;locomotion.z*=0.4;}
};
const squadRender=renderFrame;renderFrame=function(){
 squadRender();
 if(!bustPlaying)return;
 const sample=bustedSample(bustPlaying.scene,bustPlaying.t);
 const ox=player.x,oy=(player.y||1.6)-1.45,oz=player.z;
 camera.fov=sample.pose.fov;camera.updateProjectionMatrix();
 camera.position.set(ox+sample.pose.x,oy+sample.pose.y,oz+sample.pose.z);
 camera.lookAt(ox+sample.pose.lookX,oy+sample.pose.lookY,oz+sample.pose.lookZ);
 if(effects)effects.render();else renderer.render(scene,camera);
};
function gummySquadPreview(mode='spotted'){
 if(!active)load('story',1,true);
 const overlay=document.getElementById('overlay');if(overlay)overlay.hidden=true;
 if(document.body?.dataset)document.body.dataset.panel='';panel='';
 bustPlaying=null;hideBustDom();
 s.sold=Math.max(1,s.sold||0);
 const p=ensurePolice(),cop=p.officers[0];
 cop.ko=0;cop.grab=0;cop.target='host';
 if(mode==='spotted'){
  player.set(8,1.62,14);cop.x=8;cop.z=2;cop.angle=0;s.time=600;
  p.chase=spotChase(freshChase(),'suspicious');cop.squad='suspicious';cop.mode='patrol';cop.suspicion=80;
 }else if(mode==='chase'){
  player.set(6,1.62,12);cop.x=6;cop.z=4;cop.angle=0;s.time=1140;
  p.chase={stage:'pursuit',left:35,searching:true};cop.squad='pursuit';cop.mode='pursuit';
 }else if(mode==='hiding'){
  player.set(8,1.62,6.6);cop.x=13.5;cop.z=12.5;cop.angle=Math.atan2(8-13.5,6.6-12.5);s.time=700;
  p.chase={stage:'investigating',left:12,searching:true};cop.squad='investigating';cop.mode='patrol';cop.suspicion=80;
 }else if(mode==='bonk'){
  const person=streetCrowd?.people?.[0];
  player.set(person?person.x+1.4:-4,1.62,person?person.z+0.2:8);s.time=640;yaw=Math.atan2((person?.x||0)-player.x,(person?.z||0)-player.z);
  if(person){streetCrowd.knock(0,5.2,now);person.koStyle='stars';markDizzy(person.x,person.z,'stars',5.2);}
  p.chase=freshChase();cop.squad='';cop.mode='patrol';
 }else{
  player.set(6,1.62,8);s.time=900;s.cash=Math.max(s.cash||0,200);
  bustPlaying={scene:bustedTimeline(),t:2,fine:60,seized:4};
  showBustDom(bustedSample(bustPlaying.scene,2));
  cop.x=6;cop.z=5;cop.angle=Math.PI;cop.squad='all-units';cop.mode='pursuit';
  p.chase={stage:'all-units',left:45,searching:false};
 }
 if(mode!=='bonk'){yaw=0;pitch=.12;}
 syncPlayerView();
 syncSquadCast();
 if(streetCrowd)streetCrowd.update({dt:0,now:now+1,time:s.time,camera,active:true,floorHeight,blocked});
 renderFrame();
 if(mode!=='busted'){
  const person=streetCrowd?.people?.[0];
  const look=mode==='hiding'?{x:9.2,y:1.05,z:7.4}:mode==='bonk'?{x:person?.x||player.x,y:1.35,z:person?.z||player.z}:mode==='chase'?{x:6,y:1.2,z:8}:{x:8,y:.7,z:8};
  const back=mode==='bonk'?{x:-2.1,z:-1.5}:mode==='hiding'?{x:-3.4,z:-2.6}:mode==='chase'?{x:-4.2,z:-1.2}:{x:-6.5,z:-7.2};
  const up=mode==='bonk'?1.15:mode==='spotted'?5.4:2.6;
  camera.fov=mode==='spotted'?52:46;camera.updateProjectionMatrix();
  camera.position.set(look.x+back.x,look.y+up,look.z+back.z);
  camera.lookAt(look.x,look.y,look.z);
  if(effects)effects.render();else renderer.render(scene,camera);
 }
 if(active)paintHudReadout();
 const pivot=squadCast?.cone;
 return {mode,stage:p.chase?.stage||'clear',x:+player.x.toFixed(2),z:+player.z.toFixed(2),cone:pivot?{vis:!!pivot.visible,x:+pivot.position.x.toFixed(2),y:+pivot.position.y.toFixed(2),z:+pivot.position.z.toFixed(2)}:null,banner:document.getElementById('wantedLabel')?.textContent||'',bust:document.querySelector('.bust-stamp')?.textContent||''};
}
window.gummySquadPreview=gummySquadPreview;
function gummySquadChaseFrame(step=0){
 const info=gummySquadPreview('chase');
 const cop=ensurePolice().officers[0];
 const z=2+Number(step)*0.42;
 cop.z=z;cop.angle=0;cop.mode='pursuit';cop.squad='pursuit';cop.target='host';
 player.set(6,1.62,12);now+=0.12;s.time=1140;
 syncSquadCast();
 const look={x:6,y:1.15,z:(z+12)/2};
 camera.fov=46;camera.updateProjectionMatrix();
 camera.position.set(look.x-4.2,look.y+2.6,look.z-1.2);
 camera.lookAt(look.x,look.y,look.z);
 if(effects)effects.render();else renderer.render(scene,camera);
 if(active)paintHudReadout();
 return {step,z:+z.toFixed(2),banner:info.banner};
}
window.gummySquadChaseFrame=gummySquadChaseFrame;
syncSquadCast();

// v133 skateboards (P1-5). Six decks from the Kickflip Container live in hotbar
// slot 9. Equip, then click or press R to drop the board and ride in a chase
// camera. W pushes, A/D or the mouse carve, hold and release Space to ollie,
// S brakes. Kerbs over 12 cm without an ollie are a bail. Boards are an
// additive save field (boards, boardSel); older saves own none.
const skate={ride:null,model:null,modelId:'',held:null,heldId:'',rider:null,audio:null,shake:0,sparks:null,sparkAt:0,firstPerson:false,cam:null};
try{skate.firstPerson=localStorage.getItem('gummybay-skate-cam')==='fp';}catch{}
createKickflipContainer(scene);colliders.push(...KICKFLIP_COLLIDERS);
const kickflipPoint=addPoint('kickflip','Kickflip Container · Skateboards',KICKFLIP_POINT.x,KICKFLIP_POINT.z);skate.keeper=createKickflipKeeper(scene);
const skateBaseFloor=floorHeight;
floorHeight=function(x,z){const h=skateBaseFloor(x,z);return Math.abs(x-KICKFLIP_SITE.x)<12&&Math.abs(z-KICKFLIP_SITE.z-7)<5?Math.max(h,skateSpotHeight(x,z)):h;};
const skateNormalize=normalize;normalize=function(v){const out=skateNormalize(v);normalizeSkate(out??v);return out;};
function skateBoard(){return boardById(s?.boardSel)||null;}
function skateRough(x,z){if(x>-200&&x<200&&z>-120&&z<60)return false;const on=r=>Math.abs(x-r.x)<=r.w/2&&Math.abs(z-r.z)<=r.d/2;return !VEHICLE_ROADS.some(on)&&!PEDESTRIAN_WAYS.some(on);}
function skateModel(){
 const b=skateBoard();if(!b)return null;
 if(skate.modelId!==b.id+':'+gripColor(s)){if(skate.model)scene.remove(skate.model);skate.model=createBoardModel(b,{grip:gripColor(s)});skate.modelId=b.id+':'+gripColor(s);scene.add(skate.model);skate.model.visible=false;}
 return skate.model;
}
function skateHeld(){
 const b=skateBoard();if(!b)return null;
 if(skate.heldId!==b.id+':'+gripColor(s)){if(skate.held)camera.remove(skate.held);skate.held=createBoardModel(b,{shadow:false,grip:gripColor(s)});skate.heldId=b.id+':'+gripColor(s);skate.held.position.set(.42,-.62,-.78);skate.held.rotation.set(.15,.35,1.25);skate.held.scale.setScalar(.9);camera.add(skate.held);}
 return skate.held;
}
function skateSparks(){
 if(skate.sparks)return skate.sparks;
 const g=new THREE.Group();g.name='Gummy Gold sparkle trail';const geo=new THREE.OctahedronGeometry(.055,0);
 for(let i=0;i<36;i++){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:i%3?0xffe27a:0xff8fc0,transparent:true,opacity:0,depthWrite:false}));m.userData.life=0;g.add(m);}
 scene.add(g);skate.sparks=g;return g;
}
function skateVolume(){return soundEnabled?(audioLevels?.master??.8)*(audioLevels?.effects??.8):0;}
function skateAudio(){if(!skate.audio&&audioContext){try{skate.audio=createSkateAudio(audioContext,audioContext.destination);}catch(e){skate.audio=null;}}return skate.audio;}
function canRide(){return active&&!panel&&!work&&!stationTask&&!driving&&!placeMode&&net.role!=='guest';}
function mountBoard(){
 const b=skateBoard();if(!b||skate.ride||!canRide())return false;
 if(insideRvShell(player.x,player.z)||ceilingHeight(player.x,player.z)<4){toast('Take the board outside first.');return false;}
 const fwdX=-Math.sin(yaw),fwdZ=-Math.cos(yaw),carry=Math.max(0,locomotion.x*fwdX+locomotion.z*fwdZ);
 skate.ride=createRide(b,{x:player.x,z:player.z,y:floorHeight(player.x,player.z),heading:yaw,speed:Math.min(b.top,carry*.8)});
 Object.assign(locomotion,{x:0,z:0,jump:0,vertical:0,jumpQueued:0});
 skateAudio();skate.audio?.land(false,skateVolume()*.7);
 if(!s.skateTipSeen){s.skateTipSeen=true;toast('W to push · A/D carve · hold Space then release to ollie · R to step off');}
 return true;
}
function dismountBoard(quiet=false){
 if(!skate.ride)return;
 const r=skate.ride;skate.ride=null;
 if(!blocked(r.x,r.z)){player.x=r.x;player.z=r.z;}
 yaw=Math.atan2(Math.sin(yaw),Math.cos(yaw));
 Object.assign(locomotion,{x:-Math.sin(r.heading)*Math.min(r.speed,WALK_SPEED_SKATE),z:-Math.cos(r.heading)*Math.min(r.speed,WALK_SPEED_SKATE),jump:0,vertical:0});
 skate.fov=NaN;if(skate.model)skate.model.visible=false;updateRider(skate.rider,null,{visible:false});skate.audio?.stop();
 hand.scale.setScalar(1);camera.fov=fovBase;camera.updateProjectionMatrix();syncPlayerView();camera.rotation.set(pitch,yaw,0,'YXZ');
 if(!quiet)skate.audio?.push(skateVolume());
}
const WALK_SPEED_SKATE=3.6;
const skateEquip=equipTool;equipTool=function(tool){
 if(tool==='board'){
  if(!skateBoard()){toast('Buy a skateboard at the Kickflip Container, by the Coastway servo.');return;}
  if(skate.ride){dismountBoard();equippedTool=null;updateBusinessHUD();paintHotbarSelection?.();return;}
 }else if(skate.ride)dismountBoard();
 skateEquip(tool);
};
window.equipTool=equipTool;
const skateDoAction=doAction;doAction=function(k,a,b,c){
 if(k==='buyBoard'){
  if(net.role==='guest'){toast('The host owns the shop counter in co-op.');return;}
  const before=s.boardSel,result=buyBoard(s,a,n=>spend(n));
  if(result.ok){if(result.bought){toast(result.board.name+' bought. It is in hotbar slot 9.');skateAudio();skate.audio?.pop(skateVolume());}else if(before!==a)toast('Riding the '+result.board.name+' now.');equippedTool='board';save();refresh('kickflip');}
  else if(result.reason==='funds')toast('Not enough '+(s.payment==='card'?'in the bank':'cash')+' for the '+boardById(a).name+'.');
  return;
 }
 skateDoAction(k,a,b,c);
};
const skateMenu=menu;menu=function(which,data){
 if(skate.ride&&which!=='kickflip'&&!['phone','thread','map','pause','settings'].includes(which))dismountBoard(true);
 skateMenu(which,data);
 if(which!=='kickflip'||processingRemote||!active)return;
 $('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Close">×</button><div class="paymentstrip"><span>PAYMENT</span><button class="'+(s.payment==='cash'?'on':'')+'" onclick="action(\'payment\',\'cash\')">CASH '+cash(s.cash)+'</button><button class="'+(s.payment==='card'?'on':'')+'" onclick="action(\'payment\',\'card\')">CARD '+cash(s.bank)+'</button></div>'+kickflipShopHTML(s,{money:cash,available:s.payment==='card'?s.bank:s.cash,esc});
};
window.menu=menu;
// Police: a fast board while seen is bolting, a bust or a search takes the board
// off you first (the bust moves you home), and you cannot hide while riding.
skateBolting=()=>!!skate.ride&&skate.ride.speed>6.5;
const skateBust=performBust;performBust=function(){if(skate.ride)dismountBoard(true);return skateBust();};
const skateSearch=beginPoliceSearch;beginPoliceSearch=function(role,fled){if(skate.ride)dismountBoard(true);return skateSearch(role,fled);};
const skateHide=tickHide;tickHide=function(){if(skate.ride)return;return skateHide();};
const skateEnter=enterVehicle;enterVehicle=function(){if(skate.ride)dismountBoard(true);skateEnter();};
addEventListener('keydown',e=>{
 if(!active||e.repeat||panel||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 const k=e.key.toLowerCase();
 if(k==='r'&&!placeMode){if(skate.ride){dismountBoard();}else if(equippedTool==='board')mountBoard();}
 if(k==='v'&&skate.ride){skate.firstPerson=!skate.firstPerson;try{localStorage.setItem('gummybay-skate-cam',skate.firstPerson?'fp':'tp');}catch{}}
});
canvas.addEventListener?.('pointerdown',e=>{if(e.button===0&&equippedTool==='board'&&!skate.ride&&canRide())mountBoard();});
const skateUpdate=update;update=function(dt){
 const r=skate.ride;
 if(!r||!active||panel){skateUpdate(dt);return;}
 if(stationTask||driving||work){dismountBoard(true);skateUpdate(dt);return;}
 // The walking controller sees no movement keys while the board carries us.
 const real=keys,input={push:!!(real.w||real.arrowup),brake:!!(real.s||real.arrowdown),left:!!(real.a||real.arrowleft),right:!!(real.d||real.arrowright),ollieHeld:!!real[' ']};
 const quiet=Object.assign({},real,{w:false,a:false,s:false,d:false,' ':false,shift:false,arrowup:false,arrowdown:false,arrowleft:false,arrowright:false,control:false});
 keys=quiet;Object.assign(locomotion,{x:0,z:0,jump:0,vertical:0,jumpQueued:0,space:false});
 const beforeYaw=yaw;
 try{skateUpdate(dt);}finally{if(keys===quiet)keys=real;}
 if(!skate.ride||panel)return;
 // Mouse look steers the deck at the board's turn limit; A/D carve directly.
 const steer=Math.atan2(Math.sin(yaw-r.heading),Math.cos(yaw-r.heading));
 const before=r.heading;
 if(!skate.hold)stepRide(r,{...input,steer:Math.abs(steer)>.02?steer:0},dt,{floorAt:floorHeight,blocked:(x,z)=>blocked(x,z),rough:skateRough});else r.events=[];
 if(input.left||input.right)yaw+=Math.atan2(Math.sin(r.heading-before),Math.cos(r.heading-before));
 void beforeYaw;
 player.x=r.x;player.z=r.z;
 const ground=floorHeight(r.x,r.z);
 locomotion.jump=Math.max(0,r.y-ground);
 player.y=r.y+DECK_HEIGHT+1.72;
 const vol=skateVolume(),au=skateAudio();
 for(const ev of r.events){
  if(ev==='push')au?.push(vol);
  else if(ev==='ollie')au?.pop(vol);
  else if(ev==='land'||ev==='land-hard'){au?.land(ev==='land-hard',vol);skate.shake=Math.max(skate.shake,ev==='land-hard'?.35:.15);}
  else if(ev==='bail'){au?.bail(vol);skate.shake=.6;toast(r.bailReason==='wall'?'Bailed into a wall! Slow down near buildings.':'Bailed! Hold and release Space to ollie up kerbs.');}
  else if(ev==='recovered'){dismountBoard(true);return;}
 }
 au?.update(r.speed,!r.air&&r.bail===0,vol,r.dist);
 skate.shake=Math.max(0,skate.shake-dt*1.6);
 if(Number.isFinite(skate.fov)&&Math.abs(camera.fov-skate.fov)>.01){camera.fov=skate.fov;camera.updateProjectionMatrix();}
 walk=false;
};
function skateCameraPose(){
 const r=skate.ride;if(!r)return;
 const sh=skate.shake>0?skate.shake*.06:0,jx=sh?(Math.random()-.5)*sh:0,jy=sh?(Math.random()-.5)*sh:0;
 if(skate.firstPerson){
  camera.position.set(r.x,r.y+DECK_HEIGHT+1.62+jy-(r.charging?r.charge*.25:0),r.z);camera.rotation.set(pitch,yaw,-r.lean*.06+jx,'YXZ');
 }else{
  const pose=skate.cam||rideCamera(r,yaw,pitch,{blocked:(x,z)=>blocked(x,z)});
  camera.position.set(pose.x+jx,pose.y+jy,pose.z);camera.lookAt(pose.lookX,pose.lookY,pose.lookZ);
  if(!skate.cam)camera.rotateZ(-r.lean*.04);
 }
 const fov=skateFov(fovBase,r.speed);skate.fov=Number.isFinite(skate.fov)?skate.fov+(fov-skate.fov)*.12:camera.fov;if(Math.abs(camera.fov-skate.fov)>.01){camera.fov=skate.fov;camera.updateProjectionMatrix();}
}
function skateSparkle(dt){
 const r=skate.ride,g=skate.sparks;
 if(r&&r.board.sparkle&&r.speed>2&&now-skate.sparkAt>.04){skate.sparkAt=now;const m=skateSparks().children.find(c=>c.userData.life<=0);if(m){m.userData.life=1;m.position.set(r.x+Math.sin(r.heading)*.45+(Math.random()-.5)*.2,r.y+.05+Math.random()*.12,r.z+Math.cos(r.heading)*.45+(Math.random()-.5)*.2);}}
 if(g)for(const m of g.children){if(m.userData.life>0){m.userData.life-=dt*1.4;m.material.opacity=Math.max(0,m.userData.life);m.rotation.y+=dt*6;m.position.y+=dt*.15;}else m.material.opacity=0;}
}
let skateLastRender=0;
const skateRender=renderFrame;renderFrame=function(){
 const t=performance.now()/1000,dt=skateLastRender?Math.min(.1,t-skateLastRender):0;skateLastRender=t;
 const r=skate.ride,model=r?skateModel():null;
 if(skate.model&&skate.model!==model)skate.model.visible=false;
 if(model){
  model.visible=true;const bailT=r.bail>0?1-r.bail/BAIL_TIME:0;
  model.position.set(r.x+(bailT?Math.sin(r.heading)*-bailT*.8:0),r.y,r.z+(bailT?Math.cos(r.heading)*-bailT*.8:0));
  model.rotation.set(0,r.heading,0,'YXZ');model.rotateZ(r.lean*-.12+(bailT?bailT*2.8:0));
  if(r.charging)model.rotateX(-r.charge*.12);else if(r.air)model.rotateX(r.vy>0?-.22:.08);
  spinBoardWheels(model,r.dist);
 }
 if(!skate.rider&&r)skate.rider=createRider(scene);
 updateRider(skate.rider,r,{visible:!!r&&!skate.firstPerson,t,look:riderLook(s.arcade?.hat?0x7b3fb5:null)});
 skateSparkle(dt);
 if(skate.keeper&&Math.hypot(player.x-KICKFLIP_SITE.x,player.z-KICKFLIP_SITE.z)<45)updateKickflipKeeper(skate.keeper,t,{talk:panel==='kickflip'});
 if(r){skateCameraPose();hand.scale.setScalar(1e-4);}
 const held=equippedTool==='board'&&!r&&active&&!panel&&!stationTask&&!driving&&!placeMode?skateHeld():null;
 if(skate.held)skate.held.visible=!!held&&skate.held===held;
 if(held){held.position.y=-.62+(walk&&comfort.bob?Math.sin(walkPhase)*.012:0);}
 skateRender();
};
const skateHUD=paintS1Hud;paintS1Hud=function(){
 skateHUD();
 const b=document.querySelector?.('.hotbar .slot[data-slot="board"]');if(!b)return;
 const owned=!!skateBoard();b.classList.toggle('empty',!owned);b.classList.toggle('selected',equippedTool==='board');b.setAttribute('aria-pressed',String(equippedTool==='board'));
 const em=b.querySelector('em');if(em)em.textContent=skate.ride?Math.round(skate.ride.speed*3.6)+'':'';
 const deck=b.querySelector('.deck');if(deck&&owned)deck.setAttribute('fill','#'+skateBoard().deck.toString(16).padStart(6,'0'));
 document.body.classList.toggle('skating',!!skate.ride);
};
if(typeof window!=='undefined')window.__skate={
 grant:(id='street')=>{normalizeSkate(s);if(!s.boards.includes(id))s.boards.push(id);s.boardSel=id;save();return s.boards.slice();},
 equip:()=>{equippedTool='board';return equippedTool;},mount:()=>mountBoard(),dismount:()=>dismountBoard(),
 teleport:(x,z,h=yaw)=>{player.x=x;player.z=z;yaw=h;if(skate.ride){skate.ride.x=x;skate.ride.z=z;skate.ride.heading=h;skate.ride.y=floorHeight(x,z);}syncPlayerView();return [x,z];},
 set:(o={})=>{if(skate.ride)Object.assign(skate.ride,o);return !!skate.ride;},
 cam:p=>{skate.cam=p||null;return !!p;},hold:on=>{skate.hold=!!on;return skate.hold;},look:(y,p)=>{yaw=y;pitch=p??pitch;},
 state:()=>{const r=skate.ride;return {owned:s?.boards?.slice()||[],sel:s?.boardSel||null,equipped:equippedTool,riding:!!r,speed:r?r.speed:0,y:r?r.y:0,air:r?r.air:false,bail:r?r.bail:0,x:player.x,z:player.z,fov:camera.fov,panel};},
 point:()=>({x:kickflipPoint.x,z:kickflipPoint.z}),
 hour:h=>{s.time=h*60;return s.time;},cash:n=>{s.cash=n;updateUI();return s.cash;},
 chase:(stage='pursuit',d=12)=>{s.day=Math.max(2,s.day);s.sold=Math.max(1,s.sold||0);squadAwake=true;const p=ensurePolice();p.cooldown=0;p.search=null;p.chase=spotChase(freshChase(),stage);const cop=p.officers[0];if(!cop)return 'no officer';cop.squad=p.chase.stage;cop.target=localPoliceRole();cop.mode='pursuit';cop.ko=0;cop.x=player.x+Math.sin(yaw)*d;cop.z=player.z+Math.cos(yaw)*d;cop.angle=Math.atan2(player.x-cop.x,player.z-cop.z);return p.chase.stage;},
 police:()=>{const p=ensurePolice(),cop=p.officers.find(c=>c.squad)||p.officers[0];return {stage:p.chase?.stage||'clear',arrests:p.arrests||0,copDist:cop?Math.round(Math.hypot(cop.x-player.x,cop.z-player.z)*10)/10:null,riding:!!skate.ride,bust:!!bustPlaying};}
};

// v133 City expansion (P1-3): compact filler blocks, named businesses, alleys and the expressway.
// Planned last, against every collider and gameplay point that exists by now, plus the
// Blender town's gap shells (baked, because the GLB loads after this runs).
var cityExpansion=null;
if(!(typeof location!=='undefined'&&/[?&]city=0\b/.test(location.search)))try{
 const cityBase=colliders.length;
 cityExpansion=createCityExpansion({scene,obstacles:colliders.concat(CITY_SHELLS),points,routes:policeRoutes,quality,height:terrainHeight});
 colliders.push(...cityExpansion.colliders);
 window.__gummyCity={atlas:()=>cityExpansion.signMaterial?.map?.image?.toDataURL?.(),stats:()=>cityExpansion.stats(),businesses:()=>cityExpansion.businesses,shells:()=>colliders.slice(cityBase+cityExpansion.colliders.length).map(c=>[+c.x.toFixed(2),+c.z.toFixed(2),+c.w.toFixed(2),+c.d.toFixed(2)])};
 const cityReset=resetSystems;resetSystems=function(){cityReset();
  const lots=cityExpansion.colliders;
  const p=relocateFromInfill(player,lots,(x,z)=>!blocked(x,z));player.x=p.x;player.z=p.z;s.x=p.x;s.z=p.z;
  const v=relocateFromInfill(vehiclePose,lots,(x,z)=>!blocked(x,z)&&!blocked(x-2,z-3)&&!blocked(x+2,z+3));vehiclePose.x=v.x;vehiclePose.z=v.z;s.vehiclePark={...vehiclePose};
 };
 const cityRender=renderFrame;renderFrame=function(){cityExpansion.update({night:sceneLighting(s.time,active).night,quality,camera});cityRender();};
}catch(error){console.warn('City expansion skipped',error);}

// v134 Lighting and visual polish: bounce/moon fill, lifted hemisphere colours,
// instanced street lamps with fake light pools, overpass soffit lights and
// stylised trees placed only on free ground (never in front of a shopfront).
var streetLighting=null;const fillLight=new THREE.AmbientLight(0xffffff,0);fillLight.name='Readability fill';scene.add(fillLight);
let lastGrade=readabilityGrade(sceneLighting(s?.time??540,active));
const gradeBaseRefresh=refreshWorldLighting;refreshWorldLighting=function(){gradeBaseRefresh();
 const plan=sceneLighting(s.time,active),g=readabilityGrade(plan);lastGrade=g;
 fillLight.intensity=g.fill;fillLight.color.setHex(g.fillColor);hemi.intensity*=g.hemiScale;hemi.color.setHex(g.hemiSky);hemi.groundColor.setHex(g.hemiGround);
 streetLighting?.update(g);
};
try{
 const grid=cityExpansion?.plan?.grid;
 const opZ=OVERPASS.z,soffit=[];for(let x=-262;x<262;x+=30){if(CITY_ROADS.x.concat([0]).some(rx=>Math.abs(x-rx)<10))continue;for(const dz of [-4.2,4.2])soffit.push({x,y:OVERPASS.y-.35,z:opZ+dz});}
 const spots=streetLampSpots({roadsZ:CITY_ROADS.z,roadsX:CITY_ROADS.x.concat([0]),skipZ:[0,opZ],obstacles:colliders,points});
 const grid0=grid;const freeTree=(x,z)=>grid0?grid0.free(x-2.6,x+2.6,z-2.6,z+2.6):false;
 // Old Town dressing: off the road bands, colliders, doors, police lanes and every crowd stop / walk line.
 const crowd=[];for(let i=0;i<STREET_CROWD_SIZE*2;i++){const c=crowdRoute(i);crowd.push({a:[c.home.x,c.home.z],b:[c.job.x,c.job.z]});for(const k of ['bench','vend','atm','street'])crowd.push({a:[c[k].x,c[k].z],b:[c.home.x,c.home.z]},{a:[c[k].x,c[k].z],b:[c.job.x,c.job.z]});}
 const dress=dressingSpots({roadBands:[{axis:'z',at:0,half:11.5},{axis:'x',at:0,half:11.5}],colliders,points,routes:policeRoutes,crowd,max:28});
 const oldTrees=dress.filter(d=>d.kind==='tree'),planterSpots=dress.filter(d=>d.kind==='planter');
 streetLighting=createStreetDressing({scene,lamps:spots,soffit,trees:treeSpots({free:freeTree,step:8,max:220,extra:oldTrees}),planters:planterSpots,height:terrainHeight});
 for(const d of oldTrees)colliders.push({x:d.x,z:d.z,w:.7,d:.7,cityProp:'tree'});for(const d of planterSpots)colliders.push({x:d.x,z:d.z,w:1.5,d:1.5,cityProp:'planter'});
 streetLighting.update(lastGrade);
 window.__gummyLight={stats:()=>({lamps:streetLighting.lamps,soffit:streetLighting.soffit,meshes:streetLighting.meshes.length,trees:streetLighting.trees,oldTownTrees:oldTrees.length,planters:streetLighting.planters,verts:streetLighting.verts,grade:lastGrade})};
}catch(error){console.warn('Street lighting skipped',error);}
// v133 static batching: once the Blender town has settled, merge loose static meshes
// into per-material cells (browser only; a moved or hidden source splits its batch back).
var staticBatcher=null;
if(typeof location!=='undefined'&&!/[?&]batch=0\b/.test(location.search))try{
 // v146: static signs (immutable shared lettering, 1024x256 canvases) pack into single-column 1024x4096 atlases of 16 boards and
// draw as one mesh per atlas instead of one draw call per board. A single column keeps the mirrored back-face lookup
// (u -> 1-u) inside the same board. Like the static batcher, any later change to a packed sign (visibility, material,
// re-parenting, movement or a redrawn map) splits its atlas back into the original meshes, so behaviour never changes.
 const signAtlases=[];
 const splitSignAtlas=rec=>{if(rec.split)return;rec.split=true;scene.remove(rec.mesh);rec.mesh.geometry.dispose();rec.mesh.material.dispose();rec.tex.dispose();
  for(const o of rec.signs){const v=o.__av,m=o.__am;delete o.visible;delete o.material;o.visible=v;o.material=m;delete o.__av;delete o.__am;delete o.__atlas;if(!o.parent)scene.add(o);}};
 const signSnap=o=>[...o.position.toArray(),...o.quaternion.toArray(),...o.scale.toArray()];
 const buildSignAtlases=()=>{
  const list=scene.children.filter(o=>o.isMesh&&o.geometry===signPlane&&o.userData.signText!=null&&o.userData.dynamicSign===false&&o.visible&&!o.children.length&&!Array.isArray(o.material)&&o.material?.map?.image?.width===1024&&o.material.map.image.height===256);
  if(list.length<4)return;scene.updateMatrixWorld(true);
  const mats=[...new Set(list.map(o=>o.material))],P=signPlane.attributes.position,U=signPlane.attributes.uv,I=signPlane.index,v=new THREE.Vector3();
  for(let a=0;a*16<mats.length;a++){
   const chunk=mats.slice(a*16,a*16+16),rows=chunk.length,signs=list.filter(o=>chunk.includes(o.material));if(signs.length<2)continue;
   const c=document.createElement('canvas');c.width=1024;c.height=256*rows;const g=c.getContext('2d');chunk.forEach((m,i)=>g.drawImage(m.map.image,0,i*256));
   const m0=chunk[0].map,tex=new THREE.CanvasTexture(c);tex.colorSpace=m0.colorSpace;tex.anisotropy=m0.anisotropy;tex.minFilter=m0.minFilter;tex.magFilter=m0.magFilter;tex.generateMipmaps=m0.generateMipmaps;tex.needsUpdate=true;
   const pos=[],uv=[],idx=[];
   for(const o of signs){const row=chunk.indexOf(o.material),base=pos.length/3;
    for(let k=0;k<P.count;k++){v.fromBufferAttribute(P,k).applyMatrix4(o.matrixWorld);pos.push(v.x,v.y,v.z);uv.push(U.getX(k),(rows-1-row+U.getY(k))/rows);}
    for(let k=0;k<I.count;k++)idx.push(base+I.getX(k));}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeBoundingSphere();
   const mat=readableBothSides(new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide,toneMapped:false}));
   const mesh=new THREE.Mesh(geo,mat);mesh.name='Sign atlas';mesh.matrixAutoUpdate=false;mesh.userData.signAtlas=signs.length;scene.add(mesh);
   const rec={mesh,tex,signs,snaps:new Map(signs.map(o=>[o,signSnap(o)])),maps:new Map(chunk.map(m=>[m,m.map.version])),split:false};signAtlases.push(rec);
   for(const o of signs){o.__av=o.visible;o.__am=o.material;o.__atlas=rec;scene.remove(o);
    Object.defineProperty(o,'visible',{configurable:true,enumerable:true,get(){return this.__av;},set(x){if(x!==this.__av){this.__av=x;splitSignAtlas(rec);}}});
    Object.defineProperty(o,'material',{configurable:true,enumerable:true,get(){return this.__am;},set(x){if(x!==this.__am){this.__am=x;splitSignAtlas(rec);}}});}
  }};
 let signCheck=0;const checkSignAtlases=()=>{if(++signCheck%60)return;for(const rec of signAtlases){if(rec.split)continue;
  if(rec.signs.some(o=>o.parent||signSnap(o).some((x,j)=>Math.abs(x-rec.snaps.get(o)[j])>1e-6))||[...rec.maps].some(([m,ver])=>m.map?.version!==ver))splitSignAtlas(rec);}};
 window.__signAtlas={stats:()=>({atlases:signAtlases.filter(r=>!r.split).length,signs:signAtlases.filter(r=>!r.split).reduce((n,r)=>n+r.signs.length,0),split:signAtlases.filter(r=>r.split).length}),splitAll:()=>signAtlases.forEach(splitSignAtlas)};
staticBatcher=createStaticBatcher(scene);window.__gummyBatcher=staticBatcher;let batchState='waiting';
 const batchRender=renderFrame;renderFrame=function(){
  if(batchState==='waiting'&&townAssetStatus!=='loading'){batchState='built';try{buildSignAtlases();}catch(error){console.warn('Sign atlas skipped',error);}try{for(const o of smallDetails)o.visible=true;window.__gummyBatch=staticBatcher.build();}catch(error){console.warn('Static batching skipped',error);}}
  else if(batchState==='built'){staticBatcher.update(camera);checkSignAtlases();}
  batchRender();
 };
}catch(error){console.warn('Static batching unavailable',error);}

// v135 Lucky Pier prize arcade: walk in through the purple storefront's door.
// Tokens cost in-game cash at a fixed rate; the five cabinets pay tickets by skill
// only; tickets buy saved keepsakes (grip tape, a cap, RV posters, a daily snack).
const arcadeNormalize=normalize;normalize=function(v){const out=arcadeNormalize(v);normalizeArcade(out??v);return out;};
normalizeArcade(s);
var arcadeUI=null,arcadePoint=null,rvPosterGroup=null;
function arcadeDoor(){const biz=cityExpansion?.businesses?.find(b=>b.key==='arcade');return biz?.door||null;}
function rvPosterTexture(id){const art=POSTER_ART[id];if(!art||typeof document==='undefined')return null;const c=document.createElement('canvas');c.width=192;c.height=256;const g=c.getContext('2d');if(!g)return null;
 g.fillStyle=art[0];g.fillRect(0,0,192,256);g.strokeStyle=art[1];g.lineWidth=8;g.strokeRect(10,10,172,236);g.fillStyle=art[1];g.font='900 26px "Trebuchet MS",sans-serif';g.textAlign='center';g.fillText(art[2],96,52);
 if(id==='poster-pier'){for(let i=0;i<9;i++){g.fillStyle=i%2?'#ffd23f':'#fff3b0';g.beginPath();g.arc(28+i*17,82,5,0,Math.PI*2);g.fill();}g.fillStyle='#43e8ff';g.fillRect(40,120,112,70);g.fillStyle='#2a0f45';g.fillRect(52,132,88,46);g.fillStyle='#ff5fb8';g.beginPath();g.arc(96,155,16,0,Math.PI*2);g.fill();}
 else if(id==='poster-bear'){g.fillStyle='#43e8ff';g.beginPath();g.moveTo(10,200);g.quadraticCurveTo(70,120,150,150);g.quadraticCurveTo(110,170,182,200);g.lineTo(182,246);g.lineTo(10,246);g.fill();g.fillStyle='#ff8a3d';g.beginPath();g.arc(96,112,22,0,Math.PI*2);g.arc(82,92,8,0,Math.PI*2);g.arc(110,92,8,0,Math.PI*2);g.fill();g.beginPath();g.ellipse(96,148,20,22,0,0,Math.PI*2);g.fill();g.fillStyle='#ffd23f';g.fillRect(56,170,80,8);}
 else{g.fillStyle='#ffd23f';g.save();g.translate(96,140);g.rotate(-.35);g.fillRect(-60,-10,120,20);g.fillStyle='#1d1e21';g.fillRect(-56,-6,112,12);g.restore();g.fillStyle='#fff';for(const [x,y] of [[50,185],[140,165]]){g.beginPath();g.arc(x,y,8,0,Math.PI*2);g.fill();}}
 g.font='700 14px sans-serif';g.fillStyle='rgba(255,255,255,.8)';g.fillText('GUMMY BAY',96,232);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
function refreshRvPosters(){
 if(!rvPosterGroup){rvPosterGroup=new THREE.Group();rvPosterGroup.name='RV arcade posters';scene.add(rvPosterGroup);}
 const want=ownedPosters(s).join(',');if(rvPosterGroup.userData.key===want)return;rvPosterGroup.userData.key=want;
 for(const m of [...rvPosterGroup.children]){rvPosterGroup.remove(m);m.material?.map?.dispose?.();m.material?.dispose?.();m.geometry?.dispose?.();}
 ownedPosters(s).forEach((id,i)=>{const tex=rvPosterTexture(id);const m=new THREE.Mesh(new THREE.PlaneGeometry(.48,.64),new THREE.MeshStandardMaterial({map:tex,color:tex?0xffffff:0x7b3fb5,roughness:.8}));
  m.position.set(-59.78,2.2,23.1+i*.7);m.rotation.y=Math.PI/2;m.name='RV poster '+id;rvPosterGroup.add(m);});
}
try{
 const door=arcadeDoor();
 if(door){arcadePoint=addPoint('arcade','Lucky Pier Arcade · Prize tickets',door.x,door.z);
  // A self-lit door panel so the way in reads at night without adding scene lights.
  const biz=cityExpansion.businesses.find(b=>b.key==='arcade'),c=document.createElement('canvas');c.width=256;c.height=320;const g=c.getContext('2d');
  if(g&&biz){g.fillStyle='#14072a';g.fillRect(0,0,256,320);g.shadowColor='#ff5fb8';g.shadowBlur=18;g.strokeStyle='#ff5fb8';g.lineWidth=10;g.strokeRect(14,14,228,292);g.shadowColor='#43e8ff';g.strokeStyle='#43e8ff';g.lineWidth=5;g.strokeRect(34,90,188,200);
   g.fillStyle='#ffe066';g.shadowColor='#ffd23f';g.font='900 44px "Trebuchet MS",sans-serif';g.textAlign='center';g.fillText('ARCADE',128,66);g.font='900 30px sans-serif';g.fillStyle='#fff';g.fillText('ENTER',128,180);g.font='800 20px sans-serif';g.fillStyle='#7dff6a';g.fillText('TICKETS · PRIZES',128,230);
   const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const fx=Math.sin(biz.rot),fz=Math.cos(biz.rot);
   const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.6,2),new THREE.MeshBasicMaterial({map:tex,toneMapped:false,fog:false}));sign.name='Lucky Pier door glow';sign.position.set(door.x-fx*1.72,1.15+terrainHeight(door.x,door.z),door.z-fz*1.72);sign.rotation.y=biz.rot;scene.add(sign);}
 }
 arcadeUI=createArcadeUI({
  state:()=>s,spend:n=>spend(n),save:()=>{save();updateUI();},toast:m=>toast(m),day:()=>s.day||1,
  audio:()=>({ctx:audioContext,enabled:soundEnabled}),emit:cue=>{if(window.townAudio?.emit)window.townAudio.emit(cue,{x:player.x,z:player.z});},
  money:()=>'<span>PAY WITH</span> <button class="arcBtn'+(s.payment==='cash'?'':' ghost')+'" data-arc="pay:cash">CASH '+cash(s.cash)+'</button> <button class="arcBtn'+(s.payment==='card'?'':' ghost')+'" data-arc="pay:card">CARD '+cash(s.bank)+'</button>',
  setPayment:m=>{if(m==='cash'||m==='card'){s.payment=m;save();}},
  onPrize:prize=>{if(prize?.kind==='snack'){s.xp+=prize.xp;stamina=100;save();updateUI();}refreshRvPosters();},
  onLeave:()=>{if(panel==='arcade')close();},
 });
 const arcadeMenu=menu;menu=function(which,data){
  if(which==='arcade'&&!processingRemote&&active){
   if(skate.ride){toast('Pop off the board before heading inside.');return;}
   arcadeMenu('arcade',data);$('overlay').hidden=true;arcadeUI.enter();return;
  }
  arcadeMenu(which,data);
 };window.menu=menu;
 const arcadeClose=close;close=function(){if(arcadeUI?.open){arcadeUI.leave();return;}arcadeClose();};window.closeMenu=close;
 const arcadeLoad=resetSystems;resetSystems=function(){arcadeLoad();normalizeArcade(s);refreshRvPosters();};
 refreshRvPosters();
 // The neon room covers the screen, so skip drawing the 3D town underneath it.
 const arcadeRender=renderFrame;renderFrame=function(){if(arcadeUI?.open)return;arcadeRender();};
 window.__arcade={ui:arcadeUI,door:arcadeDoor,point:()=>arcadePoint&&{x:arcadePoint.x,z:arcadePoint.z},
  enter:()=>{if(arcadePoint){player.x=arcadePoint.x;player.z=arcadePoint.z;}menu('arcade');return arcadeUI.open;},
  grant:(tokens=0,tickets=0)=>{normalizeArcade(s);s.arcade.tokens=Math.min(60,s.arcade.tokens+tokens);s.arcade.tickets+=tickets;save();return {...s.arcade};},
  state:()=>({...s.arcade,open:arcadeUI.open,view:arcadeUI.view}),posters:()=>rvPosterGroup?.children.map(m=>m.name)||[]};
}catch(error){console.warn('Lucky Pier arcade unavailable',error);}

// ---- Story Acts 2-3: phone missions, letterboxed cutscenes, the Sugar Squad raid (story-acts.mjs) ----
try{
 // Open fronts of Room 04 / Harbor workshop / Hillside house face +z (doorway-reveals frontZ); local -z = outside.
 const STORY_DOORS=HOMES.map(h=>({x:h.x,z:h.z+h.d/2,yaw:Math.PI}));
 const storyUI={el:null,view:null,cut:null,queue:[],timer:0,props:null,stash:null,choice:null,fov:null,cardId:'',stampText:''};
 const storyOn=()=>mode==='story'&&active&&net.role!=='guest';
 const ensureStory=()=>{if(!s.story||s.story.v!==STORY_VERSION)s.story=normalizeStory(s.story);return s.story;};
 const storyLoad=load;load=function(...args){const r=storyLoad(...args);s.story=normalizeStory(s.story);storyUI.queue=[];return r;};
 function storyFactsNow(){
  const st=ensureStory(),h=HOMES[s.house],x=player.x,z=player.z;
  return {sold:s.sold,called:s.called,mixed:s.mixed,boards:Array.isArray(s.boards)?s.boards.length:0,raids:st.raids,
   movedSinceRaid:st.raidHome>=0&&(s.house>st.raidHome||st.raidHome>=2)?1:0,helpers:Object.values(s.helpers||{}).filter(Boolean).length,
   tickets:s.arcade?.earned||0,time:s.time,day:s.day,heat:s.heat,atPier:Math.abs(x)<6&&z>72&&z<98,
   atBase:!!(s.room&&h&&Math.abs(x-h.x)<h.w/2&&Math.abs(z-h.z)<h.d/2)};
 }
 function storyTone(kind){
  if(typeof audioContext==='undefined'||!audioContext)return;
  try{const ctx=audioContext,t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
   if(kind==='siren'){o.type='triangle';for(let i=0;i<6;i++){o.frequency.setValueAtTime(i%2?620:860,t+i*.42);}g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.05,t+.2);g.gain.linearRampToValueAtTime(.0001,t+2.6);o.start(t);o.stop(t+2.7);}
   else if(kind==='stamp'){o.type='square';o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(60,t+.2);g.gain.setValueAtTime(.09,t);g.gain.exponentialRampToValueAtTime(.0001,t+.25);o.start(t);o.stop(t+.3);}
   else if(kind==='bonk'){o.type='sine';o.frequency.setValueAtTime(320,t);o.frequency.exponentialRampToValueAtTime(90,t+.35);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+.4);o.start(t);o.stop(t+.45);}
   else{o.type='sine';o.frequency.setValueAtTime(660,t);o.frequency.setValueAtTime(880,t+.12);g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+.4);o.start(t);o.stop(t+.45);}
  }catch(e){}
 }
 function storyDom(){
  if(storyUI.el)return storyUI.el;
  const el=document.createElement('div');el.id='storyCut';el.className='cine scene story-cut';el.hidden=true;el.setAttribute('aria-live','polite');
  el.innerHTML='<div class="cine-vignette"></div><div class="cine-fade"></div><div class="cine-bars"><i></i><i></i></div><div class="story-card-slot"></div><div class="story-stamp"></div><div class="cine-cap"><strong></strong><small></small></div><div class="cine-sub"><b></b><span></span></div><div class="cine-chyron"></div><div class="story-choice" hidden></div><button class="story-skip" type="button">Skip · Esc</button>';
  document.body.appendChild(el);storyUI.el=el;storyUI.view=createCineOverlay(el);
  el.addEventListener('click',event=>{if(event.target?.closest?.('.story-choice'))return;if(storyUI.cut)skipStoryCut();});
  return el;
 }
 const storyQ=sel=>storyUI.el?.querySelector?.(sel)||null;
 // Cutscene-only props: Sugar Squad vans and a cartoon door for the raid, the gummy float and fireworks for the finale.
 function storyProps(id,anchors){
  clearStoryProps();const g=new THREE.Group();g.name='story props '+id;const a=id==='raid'||id==='act3'?anchors.home:CUT_ANCHORS[CUTS[id].anchor];
  const c=Math.cos(a.yaw||0),sn=Math.sin(a.yaw||0),at=(dx,y,dz)=>new THREE.Vector3(a.x+dx*c-dz*sn,y,a.z+dx*sn+dz*c);
  const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.6,...extra});
  const add=(geo,m,pos,parent=g)=>{const mesh=new THREE.Mesh(geo,m);mesh.position.copy(pos);mesh.castShadow=true;parent.add(mesh);return mesh;};
  const ground=p=>{try{return typeof terrainHeight==='function'?terrainHeight(p.x,p.z):0;}catch(e){return 0;}};
  if(id==='raid'){
   g.userData.lights=[];
   for(const [dx,dz,turn] of [[-4.8,-6.6,.55],[4.9,-8.2,-.45]]){
    const van=new THREE.Group(),p=at(dx,0,dz);van.position.set(p.x,ground(p),p.z);van.rotation.y=(a.yaw||0)+turn;
    add(new THREE.BoxGeometry(2.3,1.9,4.6),mat(0xf3f1ea),new THREE.Vector3(0,1.25,0),van);
    add(new THREE.BoxGeometry(2.34,.42,4.64),mat(0x2f62c9),new THREE.Vector3(0,1.05,0),van);
    add(new THREE.BoxGeometry(2.1,.7,1.2),mat(0x9fc4dd,{roughness:.2}),new THREE.Vector3(0,1.75,-2.0),van);
    for(const [x,col] of [[-.5,0xff2a3c],[.5,0x2a6bff]]){const l=add(new THREE.BoxGeometry(.85,.22,.42),new THREE.MeshBasicMaterial({color:col,toneMapped:false}),new THREE.Vector3(x,2.32,-.6),van);g.userData.lights.push(l);}
    for(const [x,z] of [[-1.1,-1.5],[1.1,-1.5],[-1.1,1.5],[1.1,1.5]]){const w=add(new THREE.CylinderGeometry(.42,.42,.3,12),mat(0x22252b),new THREE.Vector3(x,.42,z),van);w.rotation.z=Math.PI/2;}
    g.add(van);
   }
   const door=new THREE.Group(),dp=at(0,0,-.15);door.position.set(dp.x,ground(dp),dp.z);door.rotation.y=a.yaw||0;
   add(new THREE.BoxGeometry(2.4,2.5,.14),mat(0x8a5a33),new THREE.Vector3(0,1.25,0),door);
   add(new THREE.BoxGeometry(2.1,.18,.18),mat(0x6d4526),new THREE.Vector3(0,1.9,-.08),door);add(new THREE.BoxGeometry(2.1,.18,.18),mat(0x6d4526),new THREE.Vector3(0,.6,-.08),door);
   add(new THREE.SphereGeometry(.09,8,6),mat(0xe8c14a,{metalness:.6}),new THREE.Vector3(.9,1.2,-.12),door);
   door.userData.home=door.position.clone();g.userData.door=door;g.add(door);
  }
  if(id==='finale'){
   const bear=new THREE.Group(),gum=mat(0xe8414f,{roughness:.25,transparent:true,opacity:.88,emissive:0x5a0a12,emissiveIntensity:.4});
   add(new THREE.SphereGeometry(1.7,20,16),gum,new THREE.Vector3(0,2.2,0),bear);add(new THREE.SphereGeometry(1.25,20,16),gum,new THREE.Vector3(0,4.4,0),bear);
   for(const x of [-.85,.85])add(new THREE.SphereGeometry(.45,12,10),gum,new THREE.Vector3(x,5.45,0),bear);
   for(const x of [-.45,.45])add(new THREE.SphereGeometry(.13,8,6),mat(0x2a0a0e),new THREE.Vector3(x,4.6,-1.1),bear);
   add(new THREE.BoxGeometry(4.6,.5,4.2),mat(0xd9b25a),new THREE.Vector3(0,.45,0),bear);
   const p=at(0,0,16);bear.position.set(p.x,.3,p.z);bear.userData.from=17;bear.userData.to=9;g.userData.bear=bear;g.add(bear);
   const burst=new THREE.InstancedMesh(new THREE.SphereGeometry(.22,6,4),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false,fog:false}),180);
   burst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);const col=new THREE.Color(),cols=[0xff5a7a,0xffd24a,0x6ff0c8,0x8fb4ff,0xffa04a,0xd78bff];
   for(let i=0;i<180;i++)burst.setColorAt(i,col.setHex(cols[Math.floor(i/30)%cols.length]));burst.frustumCulled=false;burst.userData.origin=at(0,0,32);g.userData.burst=burst;g.add(burst);
  }
  scene.add(g);storyUI.props=g;
 }
 function clearStoryProps(){const g=storyUI.props;if(!g)return;scene.remove(g);g.traverse(o=>{o.geometry?.dispose?.();if(o.material&&!Array.isArray(o.material))o.material.dispose?.();});storyUI.props=null;}
 const tmpM=new THREE.Matrix4(),tmpQ=new THREE.Quaternion(),tmpS=new THREE.Vector3(),tmpP=new THREE.Vector3();
 function animateStoryProps(t){
  const g=storyUI.props;if(!g)return;const u=g.userData;
  if(u.lights)u.lights.forEach((l,i)=>{l.visible=Math.floor(t*6+i)%2===0;});
  if(u.door){const k=Math.max(0,t-3.95),d=u.door;d.position.copy(d.userData.home);if(k>0){const yw=storyUI.cut?.anchors?.home?.yaw||0;d.position.x+=Math.sin(yw)*k*3.2;d.position.z+=Math.cos(yw)*k*3.2;d.position.y+=Math.max(0,k*6-k*k*5);d.rotation.x=-Math.min(1.45,k*2.2);d.rotation.z=k*1.4;}else d.rotation.x=0;}
  if(u.bear){const b=u.bear,f=Math.max(0,Math.min(1,(t-6)/12)),z=b.userData.from+(b.userData.to-b.userData.from)*f,a=CUT_ANCHORS.pier;b.position.z=a.z+z;b.position.y=.3+Math.abs(Math.sin(t*3))*.12;b.rotation.y=Math.sin(t*1.3)*.12;}
  if(u.burst){const m=u.burst,o=m.userData.origin;for(let i=0;i<180;i++){const k=Math.floor(i/30),start=k*1.3+(k>2?14:.8),age=((t-start)%9+9)%9,life=2.2;const seed=i*12.9898,th=(seed%6.283),ph=((i*7.31)%3.14);
    let r=age<life?Math.min(1,age/.5)*7:0,sc=age<life?Math.max(0,1-age/life)*1.3:0;const cx=o.x+((k*37)%3-1)*13,cy=13+(k%3)*4,cz=o.z+(k%2)*6;
    tmpP.set(cx+Math.cos(th)*Math.sin(ph)*r,cy+Math.cos(ph)*r-age*age*.6,cz+Math.sin(th)*Math.sin(ph)*r);tmpS.setScalar(Math.max(.001,sc));tmpM.compose(tmpP,tmpQ,tmpS);m.setMatrixAt(i,tmpM);}
   m.instanceMatrix.needsUpdate=true;}
 }
 function storyCardEl(id){const slot=storyQ('.story-card-slot');if(!slot||storyUI.cardId===id)return;storyUI.cardId=id;slot.innerHTML=id?storyCardHtml(id):'';slot.classList?.toggle?.('on',!!id);}
 function storyStampEl(text){const el=storyQ('.story-stamp');if(!el||storyUI.stampText===text)return;storyUI.stampText=text;el.textContent=text||'';el.classList?.toggle?.('on',!!text);}
 function paintStoryCut(){
  const c=storyUI.cut;if(!c)return;const a=storyCutAt(c.id,c.tl,c.t);c.sample=a;const v=storyUI.view;
  v.show(true);v.bars(true);v.fade(a.fade);v.subtitle(a.sub?.who||'',a.sub?.text||'');v.caption(a.cap?.title||'',a.cap?.line||'');
  v.chyron(a.chyron?'<strong>'+a.chyron.head+'</strong><span>'+a.chyron.text+'</span>':'');storyCardEl(a.card?.card||'');storyStampEl(a.stamp?.text||'');
  for(const k of a.sfx)if(!c.sfx.has(k)){c.sfx.add(k);storyTone(k);}
  animateStoryProps(c.t);
 }
 function playStoryCut(id,{replay=false,onDone=null}={}){
  if(!CUTS[id]||storyUI.cut||storyUI.stash||!active)return false;
  if(typeof bustPlaying!=='undefined'&&bustPlaying)return false;
  if(panel){panel='';conversationPoint=null;document.body.dataset.panel='';$('overlay').hidden=true;}
  keys={};locomotion.x=locomotion.z=0;document.exitPointerLock?.();
  const anchors={home:STORY_DOORS[s.house]||STORY_DOORS[0]};
  storyDom();storyUI.view.reset();storyUI.cardId=storyUI.stampText=null;
  storyUI.cut={id,tl:cutTimeline(id,anchors),t:0,replay,onDone,sfx:new Set(),anchors,sample:null};storyUI.fov=camera.fov;
  storyUI.el.dataset.cut=id;storyProps(id,anchors);paintStoryCut();
  if(!replay){s.story=markSeen(ensureStory(),id);save();}
  return true;
 }
 function endStoryCut(){
  const c=storyUI.cut;if(!c)return;storyUI.cut=null;clearStoryProps();
  storyUI.view.show(false);storyUI.view.bars(false);storyCardEl('');storyStampEl('');
  if(storyUI.fov){camera.fov=storyUI.fov;camera.updateProjectionMatrix();}
  syncPlayerView();camera.rotation.set(pitch,yaw,0);
  if(c.onDone)c.onDone();
 }
 function skipStoryCut(){if(storyUI.cut){storyUI.cut.t=storyUI.cut.tl.duration;endStoryCut();}}
 function tickStoryCut(dt){const c=storyUI.cut;if(!c)return;if(!storyUI.hold)c.t+=dt;if(c.t>=c.tl.duration){endStoryCut();return;}paintStoryCut();}

 // ---- The raid: cutscene, then hide the stash (minigame) or flee out the back ----
 function startRaid(kind){
  const st=ensureStory();st.lastRaidDay=s.day;
  return playStoryCut('raid',{onDone:()=>raidChoice(kind)});
 }
 function raidChoice(kind){
  storyDom();const box=storyQ('.story-choice'),v=storyUI.view;v.show(true);v.bars(true);v.fade(.35);v.subtitle('INSPECTOR HARDTACK','Search the place! Every jar, every drawer!');
  storyUI.choice={kind};storyUI.el.dataset.cut='raid-choice';
  const stock=(s.packs||[]).reduce((a,b)=>a+b,0)+(s.storedPacks||[]).reduce((a,b)=>a+b,0);
  if(box){box.hidden=false;box.innerHTML='<div class="overline">SUGAR SQUAD RAID</div><h2>They’re coming in. Quick!</h2><p>'+stock+' packs at risk. Cash and equipment are safe.</p><div class="story-choice-row"><button class="primary" onclick="__story.choose(\'hide\')"><b>1</b> Hide the stash<small>Drop the jars in the vent · lose up to 50%</small></button><button onclick="__story.choose(\'flee\')"><b>2</b> Flee out the back<small>Grab what you can · lose 30%</small></button></div>';}
 }
 function chooseRaid(choice){
  if(!storyUI.choice)return false;const kind=storyUI.choice.kind;storyUI.choice=null;
  if(choice==='flee'){resolveRaid(kind,'flee',0);return true;}
  const game=createStashGame({seed:(s.day*97+ensureStory().raids*13+7)>>>0});storyUI.stash={game,t:0,kind};storyUI.el.dataset.cut='raid-stash';
  const box=storyQ('.story-choice');if(box){box.hidden=false;box.innerHTML='<div class="overline">HIDE THE STASH · 6 SECONDS</div><h2>Drop the jars in the vent!</h2><div class="stash-lanes">'+[0,1,2,3].map(i=>'<button class="stash-lane" data-lane="'+i+'" onclick="__story.hit('+i+')"><span class="jar"></span><em>'+(i+1)+'</em></button>').join('')+'</div><div class="stash-meter"><i></i></div><p class="stash-count">0 / '+game.jars.length+' hidden</p>';}
  storyUI.view.subtitle('','Tap a jar, or press 1–4, while it shows.');
  return true;
 }
 function stashHit(lane){const st=storyUI.stash;if(!st)return -1;const r=st.game.hit(lane,st.t);paintStash();if(st.game.done(st.t))finishStash();return r;}
 function paintStash(){const st=storyUI.stash;if(!st||!storyUI.el?.querySelectorAll)return;const live=st.game.live(st.t).map(j=>j.lane);
  storyUI.el.querySelectorAll('.stash-lane').forEach(b=>b.classList.toggle('live',live.includes(Number(b.dataset.lane))));
  const m=storyQ('.stash-meter i');if(m)m.style.width=Math.max(0,100-st.t/st.game.duration*100)+'%';const n=storyQ('.stash-count');if(n)n.textContent=st.game.saved+' / '+st.game.jars.length+' hidden';}
 function tickStash(dt){const st=storyUI.stash;if(!st)return;st.t+=dt;paintStash();if(st.game.done(st.t))finishStash();}
 function finishStash(){const st=storyUI.stash;if(!st)return;storyUI.stash=null;resolveRaid(st.kind,'hide',st.game.score());}
 function resolveRaid(kind,choice,score){
  const out=applyRaid({packs:s.packs,storedPacks:s.storedPacks,heat:s.heat},{choice,score});
  s.packs=out.packs;s.storedPacks=out.storedPacks;s.heat=Math.min(s.heat,out.heat);
  s.story=recordRaid(ensureStory(),{day:s.day,home:s.house});
  const box=storyQ('.story-choice');if(box){box.hidden=true;box.innerHTML='';}
  storyUI.view.show(false);storyUI.view.bars(false);storyUI.el.dataset.cut='';
  const how=choice==='flee'?'You slipped out the back.':'Stash hidden: '+Math.round(score*100)+'%.';
  toast('🚨 Raid over. '+how+' '+(out.lost?out.lost+' packs confiscated.':'Nothing found!')+' Hardtack leaves empty-handed… mostly.');
  storyUI.lastRaid={kind,choice,score,lost:out.lost};save();if(active&&!panel)lock();
 }

 // ---- Progression: checked twice a second, outside menus and cutscenes ----
 // v143: never cut away mid-chase, mid-drive, mid-ride or inside the arcade/a station; the queue waits.
 function storyHoldFacts(){return {chase:s.police?.chase?.stage||'clear',search:!!s.police?.search,driving:typeof driving!=='undefined'&&driving,skateSpeed:typeof skate!=='undefined'&&skate.ride?Math.abs(skate.ride.speed||0):0,arcade:typeof arcadeUI!=='undefined'&&!!arcadeUI?.open,station:typeof stationTask!=='undefined'&&!!stationTask,placing:typeof placeMode!=='undefined'&&!!placeMode};}
 function storyTick(dt){
  storyUI.timer+=dt;if(storyUI.timer<.5)return;storyUI.timer=0;
  if(!storyOn()||panel||work||storyUI.cut||storyUI.stash||storyUI.choice)return;
  if(typeof cine!=='undefined'&&cine.scene)return;if(typeof bustPlaying!=='undefined'&&bustPlaying)return;
  if(storyHold(storyHoldFacts()))return;
  if(storyUI.queue.length){playStoryCut(storyUI.queue.shift());return;}
  const f=storyFactsNow(),due=raidDue(ensureStory(),f);
  if(due&&(due==='story'||ensureStory().done.includes('a2-raid'))){startRaid(due);return;}
  const r=stepStory(s.story,f);if(!r.events.length)return;s.story=r.story;
  for(const e of r.events){
   if(e.type==='complete'){const rw=e.reward;s.cash+=rw.cash||0;s.xp+=rw.xp||0;toast('★ '+e.title+' complete'+(rw.cash?' · +'+cash(rw.cash):'')+' · +'+rw.xp+' XP'+(rw.title?' · “'+rw.title+'”':''));}
   else if(e.type==='open'){const act=ACTS.find(a=>a.id===e.act);if(act&&!r.events.some(x=>x.type==='cut'))toast('📖 '+act.title+' · new missions in your phone');}
   else if(e.type==='cut')storyUI.queue.push(e.id);
  }
  save();
 }
 const storyUpdate=update;update=function(dt){
  if(storyUI.cut||storyUI.stash||storyUI.choice){keys={};locomotion.x=locomotion.z=0;if(storyUI.cut)tickStoryCut(dt);else if(storyUI.stash)tickStash(dt);return;}
  storyUpdate(dt);if(active)storyTick(dt);
 };
 const storyCam=()=>{const a=storyUI.cut?.sample;if(!a)return false;camera.position.set(a.pose.x,a.pose.y,a.pose.z);camera.lookAt(a.pose.lookX,a.pose.lookY,a.pose.lookZ);if(Math.abs(camera.fov-a.pose.fov)>.01){camera.fov=a.pose.fov;camera.updateProjectionMatrix();}return true;};
 const storyRender=renderFrame;renderFrame=function(){
  if(!storyUI.cut){storyRender();return;}
  storyCam();storyRender();const a=storyUI.cut?.sample;
  if(a&&(Math.abs(camera.position.x-a.pose.x)>.01||Math.abs(camera.position.z-a.pose.z)>.01)){storyCam();if(effects)effects.render();else renderer.render(scene,camera);}
 };
 addEventListener('keydown',event=>{
  if(!storyUI.cut&&!storyUI.stash&&!storyUI.choice)return;
  const key=String(event.key||'').toLowerCase();
  if(storyUI.cut){if(key==='escape'||key==='enter'||key===' ')skipStoryCut();}
  else if(storyUI.choice){if(key==='1'||key==='h')chooseRaid('hide');else if(key==='2'||key==='f')chooseRaid('flee');}
  else if(storyUI.stash&&['1','2','3','4'].includes(key))stashHit(Number(key)-1);
  event.preventDefault?.();event.stopImmediatePropagation?.();
 },{capture:true});

 // ---- Phone: Story missions, progress, rewards, replayable cutscenes ----
 function storyTrack(where){
  let p=null;if(where==='kickflip')p={x:KICKFLIP_POINT.x,z:KICKFLIP_POINT.z,label:'Kickflip Container'};
  else if(where==='arcade'){const d=window.__arcade?.door?.();if(d)p={x:d.x,z:d.z,label:'Lucky Pier arcade'};}
  else if(where==='home'){const d=STORY_DOORS[s.house];p={x:d.x,z:d.z-1.5,label:'Your base'};}
  else {const q=points.find(q=>q.type===where);if(q)p={x:q.x,z:q.z,label:q.label};}
  if(!p)return false;track=p;close();toast('Tracking '+p.label);return true;
 }
 // v146: Gramps Gus stands on the pier once the story is complete.
 storyCastVisible=key=>{if(key!=='gramps')return true;try{const st=ensureStory();return !!st.open&&!currentQuest(st);}catch{return false;}};
 function storyHTML(){
  const st=ensureStory(),q=currentQuest(st),f=storyFactsNow(),act=currentAct(st);
  let h='<div class="overline">STORY · MISSIONS</div>';
  if(!st.open)return h+'<h2>Gramps’ notebook first.</h2><p>Make your first sale and call Gramps back. Then the town starts to notice you.</p>';
  h+='<h2>'+(act?act.title:'Story')+'</h2><p class="story-act-line">'+(act?act.line:'')+'</p>';
  if(q){const pr=questProgress(q,f);h+='<div class="story-quest"><small>'+q.giver.toUpperCase()+'</small><h3>'+q.title+'</h3><p>'+q.text+'</p><div class="story-progress"><i style="width:'+Math.round(pr.have/pr.need*100)+'%"></i></div><p class="story-meta"><b>'+pr.label+'</b> · Reward '+(q.reward.cash?cash(q.reward.cash)+' + ':'')+q.reward.xp+' XP'+(q.reward.title?' + a title':'')+'</p><button class="trackbtn" onclick="__story.track(\''+q.where+'\')">Show me the way →</button></div>';}
  else h+='<div class="story-quest done"><small>STORY COMPLETE</small><h3>'+(st.title||'Candy Baron of Gummy Bay')+'</h3><p>Free play continues. The bay is yours, for now.</p></div>';
  const done=QUESTS.filter(x=>st.done.includes(x.id));if(done.length)h+='<ol class="story-done">'+done.map(x=>'<li>✓ '+x.title+'</li>').join('')+'</ol>';
  h+='<div class="story-replays"><small>CUTSCENES</small>'+CUT_IDS.map(id=>st.seen.includes(id)?'<button onclick="__story.play(\''+id+'\',true)">▶ '+CUTS[id].title+'</button>':'<button disabled>🔒 ???</button>').join('')+'</div>';
  return h;
 }
 const storyMenu=menu;menu=function(which,data){storyMenu(which,data);if(which==='story'&&panel==='story')$('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Close">×</button><div class="story-phone">'+storyHTML()+'</div><button class="phone-home-button" onclick="phoneHome()" aria-label="Phone home">▰</button>';};window.menu=menu;
 const storyPhoneHome=phoneHome;phoneHome=function(){storyPhoneHome();if(mode!=='story'||panel!=='phone')return;const st=ensureStory(),q=currentQuest(st),pr=q&&questProgress(q,storyFactsNow());
  const card='<button class="story-phone-card" onclick="menu(\'story\')"><b>📖 STORY</b><strong>'+(!st.open?'Gramps’ notebook first':q?q.title:'Story complete')+'</strong><small>'+(pr?pr.label+' · '+currentAct(st).title:st.open?'Replay the cutscenes':'Make a sale, call Gramps')+'</small></button>';const grid=$('modal').querySelector?.('.phone-app-grid');if(grid)grid.insertAdjacentHTML('afterend',card);else $('modal').insertAdjacentHTML?.('beforeend',card);};window.phoneHome=phoneHome;
 const storyUI2=updateUI;updateUI=function(){storyUI2();if(mode!=='story'||!active)return;const st=s.story,q=st&&currentQuest(st);const el=$('objective');if(!el||!q)return;const pr=questProgress(q,storyFactsNow());
  el.insertAdjacentHTML?.('beforeend','<div class="story-hud" onclick="menu(\'story\')"><b>'+currentAct(st).title.toUpperCase()+'</b> '+q.title+' · '+pr.label+'</div>');};

 window.__story={
  held:()=>storyHold(storyHoldFacts()),state:()=>({story:JSON.parse(JSON.stringify(ensureStory())),quest:currentQuest(ensureStory())?.id||null,facts:storyFactsNow(),cut:storyUI.cut?{id:storyUI.cut.id,t:storyUI.cut.t,duration:storyUI.cut.tl.duration}:null,choice:!!storyUI.choice,stash:storyUI.stash?{t:storyUI.stash.t,saved:storyUI.stash.game.saved}:null,lastRaid:storyUI.lastRaid||null,queue:[...storyUI.queue]}),
  play:(id,replay=false)=>{if(replay&&panel){panel='';document.body.dataset.panel='';$('overlay').hidden=true;}return playStoryCut(id,{replay,onDone:id==='raid'&&!replay?()=>raidChoice('story'):null});},
  seek:t=>{if(!storyUI.cut)return null;storyUI.cut.t=Math.max(0,Math.min(storyUI.cut.tl.duration-.01,t));paintStoryCut();renderFrame();return storyUI.cut.sample&&{sub:storyUI.cut.sample.sub?.text||'',card:storyUI.cut.sample.card?.card||'',stamp:storyUI.cut.sample.stamp?.text||''};},
  skip:()=>{skipStoryCut();return !storyUI.cut;},
  raid:()=>startRaid('story'),choose:chooseRaid,hit:stashHit,track:storyTrack,
  step:()=>{storyUI.timer=1;storyTick(0);return currentQuest(ensureStory())?.id||null;},
  // Debug/QA only: hold the cut clock for stills, set the hour, mark the first n missions done.
  hold:(on=true)=>{storyUI.hold=!!on;return storyUI.hold;},hour:h=>{s.time=Math.max(0,Math.min(23.9,+h||0))*60;return s.time;},
  grant:n=>{const st=ensureStory();s.story=normalizeStory({...st,open:true,done:QUESTS.slice(0,Math.max(0,Math.min(QUESTS.length,n|0))).map(q=>q.id)});save();return currentQuest(s.story)?.id||null;}
 };
 window.__storyBusy=()=>!!(storyUI.cut||storyUI.stash||storyUI.choice);
 window.loadGame=load;
}catch(error){console.warn('Story acts unavailable',error);}
// v141 NPC gummy effects and reactions (P1-6). Customers show a cartoon look for
// 2–4 game hours after a sale (npc-fx.mjs maps every mix effect to one), rate the
// batch with an emote and a text, and townsfolk look, wave, point at board
// tricks, cower or back off from a scuffle, phone it in, and flee a chase.
// Additive save field: npcFx {contactIndex:{effects,kinds,start,until}}.
try{
 try{const npcFxStyle=document.createElement('style');npcFxStyle.textContent=NPC_BUBBLE_CSS;(document.head||document.body)?.appendChild?.(npcFxStyle);}catch{}
 const fxLayer=createNpcFxLayer({scene,camera,low:quality==='performance'});
 const npcClock=()=>(s.day-1)*1440+s.time;
 const reactUntil=new Map(),waved=new Set(),emoteFor=new Map();
 let lastScuffle=null,lastTrick=null,skateWasAir=false,skateWasBail=false;
 const contactActor=i=>visualActors.find(a=>a.g===people[i])||null;
 const favouriteOf=i=>{const id=INGREDIENTS[i%INGREDIENTS.length]?.effect;return effectById(id)?id:null;};
 const normalizeNpcFx=()=>{if(!s.npcFx||typeof s.npcFx!=='object'||Array.isArray(s.npcFx))s.npcFx={};for(const k of Object.keys(s.npcFx)){const e=s.npcFx[k];if(!e||!Array.isArray(e.kinds)||!Number.isFinite(e.until)||e.until<npcClock())delete s.npcFx[k];}};
 function applyNpcFx(i,effects){normalizeNpcFx();const entry=startFx(effects,npcClock());if(entry)s.npcFx[i]=entry;else delete s.npcFx[i];return entry;}
 const npcFxDeal=doAction;doAction=function(k,a,b,c){
  const deal=k==='deliver'?s.deals.find(d=>d.npc===a):null,before=s.sold;
  npcFxDeal(k,a,b,c);
  if(!deal||s.sold<=before||!STRAINS[deal.t]||!CONTACTS[a])return;
  npcAfterSale(a,STRAINS[deal.t].effects||[]);
 };
 // After a sale: the customer eats one (effects start), rates it with an emote and texts you.
 function npcAfterSale(a,effects){
  const fb=customerFeedback(effects,{favourite:favouriteOf(a),dislike:customerDislike(a),index:a+s.day});
  applyNpcFx(a,effects);
  s.relations[a]=Math.max(0,Math.min(100,relationship(a)+fb.relation));
  s.threads[a]?.messages?.push({mine:false,text:fb.text,mood:fb.tier});
  emoteFor.set(a,{text:fb.emote,until:now+5,tone:fb.tier==='grumpy'?'alarm':'fx'});
  if(!processingRemote)toast(CONTACTS[a].name+' texted: “'+fb.text+'”');
  save();return fb;
 }
 const npcFxReset=resetSystems;resetSystems=function(){npcFxReset();normalizeNpcFx();reactUntil.clear();waved.clear();emoteFor.clear();};
 const npcFxDizzy=markDizzy;markDizzy=function(x,z,style,seconds){npcFxDizzy(x,z,style,seconds);lastScuffle={x,z,at:now};};
 const npcFxSkate=update;update=function(dt){
  npcFxSkate(dt);
  const r=skate.ride;
  if(r){if(skateWasAir&&!r.air&&!(r.bail>0))lastTrick={x:player.x,z:player.z,at:now,kind:'point'};if(r.bail>0&&!skateWasBail)lastTrick={x:player.x,z:player.z,at:now,kind:'bail'};skateWasAir=!!r.air;skateWasBail=r.bail>0;}
  else skateWasAir=skateWasBail=false;
 };
 const chaseOn=()=>{const st=s.police?.chase?.stage;return st==='pursuit'||st==='all-units';};
 const rep=()=>{const v=Object.values(s.relations||{});return v.length?v.reduce((x,y)=>x+y,0)/v.length:0;};
 let fxBubbles=[],fxEmitters=[];
 function stepCrowdReactions(){
  const crowd=streetCrowd?.people;if(!crowd)return;
  const chase=chaseOn(),friendlyRep=rep();
  for(const person of crowd){
   const d=Math.hypot(person.x-player.x,person.z-player.z);
   if(d>10)waved.delete(person.id);
   if(person.koUntil>now)continue;
   if(person.callUntil>now){fxBubbles.push({x:person.x,y:2.25,z:person.z,text:reactionLine('call',person.id),tone:'alarm',p:0,d});continue;}
   if(d>24){if(person.react&&person.react.until<=now)person.react=null;continue;}
   const scuffle=lastScuffle&&{age:now-lastScuffle.at,distance:Math.hypot(person.x-lastScuffle.x,person.z-lastScuffle.z)};
   const trick=lastTrick&&{age:now-lastTrick.at,distance:Math.hypot(person.x-lastTrick.x,person.z-lastTrick.z)};
   let kind=chooseReaction({distance:d,friendly:crowdFriendly(person.id,friendlyRep),waved:waved.has(person.id),chase,scuffle,trick});
   const cur=person.react&&person.react.until>now?person.react:null;
   const source=(kind==='cower'||kind==='backoff')&&lastScuffle?lastScuffle:player;
   if(kind==='idle'){
    if(!cur||cur.kind==='look'){const beat=idleBeat(person.id,now);person.react=beat&&d<18?{kind:beat.kind,until:now+.2,x:person.x+Math.sin(person.yaw),z:person.z+Math.cos(person.yaw),pose:reactionPose(beat.kind,now),line:beat.line,tone:''}:null;}
   }else if(kind==='look'){if(!cur||cur.kind==='look'||cur.kind==='idle')person.react={kind:'look',until:now+.25,x:player.x,z:player.z,pose:null,line:''};}
   else{
    if(!cur||cur.kind!==kind){const line=lastTrick?.kind==='bail'&&kind==='point'?reactionLine('bail',person.id,Math.floor(now)):reactionLine(kind,person.id,Math.floor(now));person.react={kind,until:now+REACT_SECONDS[kind],x:source.x,z:source.z,pose:null,line,tone:kind==='wave'||kind==='point'?'':'alarm'};if(kind==='wave')waved.add(person.id);}
    else if(kind==='flee'){person.react.x=player.x;person.react.z=player.z;person.react.until=Math.max(person.react.until,now+1);}
   }
   const r=person.react;
   if(r&&r.kind!=='look'&&r.kind!=='flee'&&r.kind!=='backoff')r.pose=reactionPose(r.kind,now);
   // Idle chatter stays close so far-off (or indoor) townsfolk don't float captions over walls.
   if(r?.line&&r.until>now&&(r.tone==='alarm'||r.kind==='wave'||r.kind==='point'||d<11))fxBubbles.push({x:person.x,y:2.25,z:person.z,text:r.line,tone:r.tone,p:r.tone==='alarm'?0:2,d});
  }
 }
 function stepContacts(){
  normalizeNpcFxLazy();
  const clock=npcClock(),low=quality==='performance',chase=chaseOn();
  for(let i=0;i<people.length;i++){
   const a=contactActor(i);if(!a?.body)continue;
   const body=a.body;a.fxBase??={scale:body.scale.clone(),pos:body.position.clone(),rot:body.rotation.clone()};
   const entry=s.npcFx?.[i],f=fxFrame(entry,clock,now,i,{low});
   const gp=a.g.position,d=Math.hypot(gp.x-player.x,gp.z-player.z);
   body.scale.copy(a.fxBase.scale);body.position.copy(a.fxBase.pos);body.rotation.copy(a.fxBase.rot);
   const fx={scale:f.scale,tint:f.tint,face:f.face,headTurn:f.headTurn,arms:null};
   const addressed=panel&&conversationPoint?.actor===a.g;
   if(f.on){
    body.scale.set(a.fxBase.scale.x*f.scale[0],a.fxBase.scale.y*f.scale[1],a.fxBase.scale.z*f.scale[2]);
    a.fxLift=f.lift;body.position.x+=f.jitterX;body.position.z+=f.jitterZ;body.rotation.z+=f.sway;
    if(f.orbit&&!addressed){body.position.x+=Math.sin(f.orbit.angle)*f.orbit.radius;body.position.z+=Math.cos(f.orbit.angle)*f.orbit.radius-f.orbit.radius;body.rotation.y+=Math.atan2(Math.cos(f.orbit.angle),-Math.sin(f.orbit.angle));}
    a.fxRate=f.animRate;a.fxRun=!!f.orbit&&!addressed;
    if(d<40)fxEmitters.push({key:'c'+i,x:gp.x+body.position.x,y:gp.y+body.position.y,z:gp.z+body.position.z,height:1.6*f.scale[1],particles:f.particles,glow:f.glow,glowColor:0xbff7ff});
    if(d<22&&(now%8)<3.5)fxBubbles.push({x:gp.x,y:gp.y+2.1*f.scale[1]+f.lift,z:gp.z,text:fxLine(entry,now,i),tone:'fx',p:3,d});
   }else{a.fxRate=1;a.fxRun=false;a.fxLift=0;}
   // Reflective bands are pinned to the root; hide them while a gummy look scales or moves the body.
   a.g.userData.hideBands=!!f.on;
   // Ambient: look at you nearby, wave if you're friends, cover up in a chase or a scuffle.
   const scuffleNear=lastScuffle&&now-lastScuffle.at<6&&Math.hypot(gp.x-lastScuffle.x,gp.z-lastScuffle.z)<REACT_RANGE.backoff;
   const friendly=relationship(i)>=25;
   if(d>10)waved.delete('c'+i);
   const kind=chooseReaction({distance:d,friendly,waved:waved.has('c'+i),chase,scuffle:scuffleNear?{age:0,distance:2}:null,trick:lastTrick&&{age:now-lastTrick.at,distance:Math.hypot(gp.x-lastTrick.x,gp.z-lastTrick.z)}});
   let held=reactUntil.get(i);if(held&&held.until<=now){reactUntil.delete(i);held=null;}
   if(!held&&['wave','point','cower','flee'].includes(kind)){held={kind:kind==='flee'?'cower':kind,until:now+REACT_SECONDS[kind==='flee'?'cower':kind],line:kind==='flee'?reactionLine('flee',i):lastTrick?.kind==='bail'&&kind==='point'?reactionLine('bail',i):reactionLine(kind,i,Math.floor(now))};reactUntil.set(i,held);if(kind==='wave')waved.add('c'+i);}
   if(held){fx.arms=reactionPose(held.kind,now);fxBubbles.push({x:gp.x,y:gp.y+2.15,z:gp.z,text:held.line,tone:held.kind==='cower'?'alarm':'',p:held.kind==='cower'?0:2,d});}
   if(d<REACT_RANGE.look&&!f.orbit&&!addressed){const want=Math.atan2(player.x-gp.x,player.z-gp.z)-a.g.rotation.y-body.rotation.y;fx.headTurn+=Math.max(-1.1,Math.min(1.1,Math.atan2(Math.sin(want),Math.cos(want))));}
   const emote=emoteFor.get(i);if(emote){if(emote.until<=now)emoteFor.delete(i);else fxBubbles.push({x:gp.x,y:gp.y+2.2*f.scale[1]+f.lift+.15,z:gp.z,text:emote.text,tone:emote.tone,p:1,d});}
   a.fx=(f.on||fx.arms||fx.headTurn)?fx:null;
  }
 }
 let normalizedAt=-1;function normalizeNpcFxLazy(){if(now-normalizedAt>5||normalizedAt>now){normalizedAt=now;normalizeNpcFx();}}
 const npcFxAnim=actorAnimation;actorAnimation=function(a,dt,distance){
  // Zoomies lap a small circle on the body offset; feed the gait picker a run speed.
  const step=dt*(a.fxRate||1);if(a.fxRun&&step>0)a.previous.set(a.g.position.x-3*step,a.g.position.y,a.g.position.z);
  npcFxAnim(a,step,distance);
  if(a.fxLift)a.body.position.y+=a.fxLift;
 };
 const npcFxRender=renderFrame;renderFrame=function(){
  fxBubbles=[];fxEmitters=[];
  if(active&&s){stepContacts();stepCrowdReactions();}
  npcFxRender();
  const dt=Math.max(0,Math.min(.1,now-(fxLayer.last??now)));fxLayer.last=now;
  fxLayer.update(dt,active?fxEmitters:[]);
  fxBubbles.sort((x,y)=>x.p-y.p||x.d-y.d);
  fxLayer.bubbles(fxBubbles.filter(b=>b.text&&b.d<22),{hidden:!active||!!panel||driving});
 };
 window.__npcFx={layer:fxLayer,afterSale:(i,effects)=>npcAfterSale(i,effects),apply:(i,effects)=>{const e=applyNpcFx(i,effects);save();return e;},state:()=>({fx:{...(s.npcFx||{})},bubbles:fxBubbles.map(b=>b.text),emitters:fxEmitters.length,particles:fxLayer.live(),reactions:(streetCrowd?.people||[]).filter(p=>p.react&&p.react.until>now).map(p=>p.react.kind)}),
  scuffle:(x=player.x,z=player.z)=>{lastScuffle={x,z,at:now};return lastScuffle;},trick:(kind='point')=>{lastTrick={x:player.x,z:player.z,at:now,kind};return lastTrick;},
  deal:i=>{const effects=STRAINS[0].effects;return customerFeedback(effects,{favourite:favouriteOf(i),dislike:customerDislike(i),index:i});},
  // Screenshot staging: stand `dist` m in front of contact i and face them.
  view(i,dist=3.2,side=0){if(!active)load('story',1,true);const o=document.getElementById('overlay');if(o)o.hidden=true;if(document.body?.dataset)document.body.dataset.panel='';panel='';const g=people[i];if(!g)return null;const p=g.position,f=g.rotation.y+side;player.set(p.x+Math.sin(f)*dist,1.62,p.z+Math.cos(f)*dist);pitch=-.08;yaw=Math.atan2(player.x-p.x,player.z-p.z);syncPlayerView();return {x:p.x,z:p.z,name:CONTACTS[i].name};},
  crowd(id,dist=4){const c=streetCrowd?.people?.[id];if(!c)return null;if(!active)load('story',1,true);panel='';player.set(c.x+Math.sin(c.yaw)*dist,1.62,c.z+Math.cos(c.yaw)*dist);pitch=-.05;yaw=Math.atan2(player.x-c.x,player.z-c.z);syncPlayerView();return {x:c.x,z:c.z};}};
}catch(error){console.warn('NPC gummy effects unavailable',error);}

// ---- v143 Sweet Network: recruit dealers, send runners, staff the benches ----
// Rules live in dealer-network.mjs (shared with the economy sim); this block is the
// save state, the half-second tick, the phone app and some cheap in-world figures.
try{
 const NET={timer:0,tab:'dealers',spots:{},actors:{},crew:[],runner:null,lastToast:0,flash:''};
 // Figures are not town residents: keep them out of the resident/silhouette avatar list.
 const figure=(...a)=>{const g=bobble(...a);const k=avatars.indexOf(g);if(k>=0)avatars.splice(k,1);return g;};
 const absNow=()=>(s.day|0)*1440+Math.floor(s.time||0);
 const ensureEmpire=()=>{if(!s.empire)s.empire=freshEmpire(absNow(),(Math.floor(Math.random()*1e9)|1)>>>0);if(s.empire.v!==1||!s.empire._ok){s.empire=normalizeEmpire(s.empire,{clock:absNow(),strainCount:STRAINS.length});Object.defineProperty(s.empire,'_ok',{value:true,enumerable:false});}if(s.empire.clock>absNow())s.empire.clock=absNow();return s.empire;};
 const lvl=()=>level();
 const bestBase=()=>{let b=0;for(let i=0;i<BASE_COUNT;i++)if(STRAINS[i].level<=lvl())b=i;return b;};
 const netCtx=()=>({to:absNow(),price:t=>STRAINS[t]?value(t):0,baseCount:BASE_COUNT,bestBase,seedCost:b=>STRAINS[b].seed,name:t=>STRAINS[t]?.name||'gummies',
  storageLeft:()=>storageCapacity()-storedUsed(),
  benchPlan:strain=>{
   if(strain>=BASE_COUNT){const p=STRAINS[strain];return p?.mixed&&s.mixer&&s.raw[p.base]>0&&(s.ingredients[p.ingredient]||0)>0?{out:strain,base:p.base,ing:p.ingredient}:null;}
   if(strain>=0)return s.raw[strain]>0?{out:strain,base:strain}:null;
   let b=-1;for(let i=0;i<BASE_COUNT;i++)if(s.raw[i]>0&&(b<0||value(i)>value(b)))b=i;return b<0?null:{out:b,base:b};},
  benchUse:plan=>{if(!(s.raw[plan.base]>0))return false;if(plan.ing!=null){if(!(s.ingredients[plan.ing]>0))return false;s.ingredients[plan.ing]--;}s.raw[plan.base]--;s.made=(s.made||0)+1;return true;}});
 const netOn=()=>active&&net.role!=='guest';
 function netRun(){if(!netOn())return [];ensureEmpire();const ev=advanceEmpire(s,netCtx());
  const loud=ev.filter(e=>e.kind==='bust'||e.kind==='short');const pick=loud[loud.length-1]||ev.filter(e=>e.kind==='cash').pop();
  if(pick&&performance.now()-NET.lastToast>2500){NET.lastToast=performance.now();toast(pick.text);}
  if(ev.length&&panel==='sweetnet')menu('sweetnet');return ev;}
 // ---- Where the dealers stand: their district, nudged onto open pavement ----
 function freeSpot(x,z){const clear=(x,z)=>!blocked(x,z)&&!blocked(x+.9,z)&&!points.some(q=>Math.hypot(q.x-x,q.z-z)<6);if(clear(x,z))return {x,z};for(let r=1;r<=18;r+=1)for(let i=0;i<16;i++){const a=i*Math.PI/8,p={x:x+Math.cos(a)*r,z:z+Math.sin(a)*r};if(clear(p.x,p.z))return p;}return {x,z};}
 DEALER_ROSTER.forEach((d,i)=>{const p=freeSpot(d.x,d.z);NET.spots[d.id]=p;
  const g=figure(p.x,p.z,d.color,0xd8b48f,0x3d2b22,1);g.userData.name=d.name;g.rotation.y=Math.atan2(-p.x,-p.z);g.visible=false;
  // v146: the dealer is drawn by the shared people kit; the bobble group stays as the visibility/position anchor.
  if(streetCrowd?.follow?.(d.name,g))g.traverse(o=>{if(o.isMesh)o.visible=false;});
  const stall=new THREE.Group();stall.position.set(p.x+.9,0,p.z);scene.add(stall);
  box(0,.45,0,.9,.9,.6,0x8a5a3a,false,stall);box(0,1.05,0,.98,.08,.68,d.color,false,stall);
  for(let k=0;k<3;k++)box(-.28+k*.28,.95,.1,.16,.1,.16,[0xff6f8a,0xffd36b,0x8be0a4][k],false,stall);stall.visible=false;
  NET.actors[d.id]={g,stall};
  addPoint('netdealer',d.name+' · '+d.district+' dealer',p.x,p.z,{i});});
 const netVisible=pointVisible;pointVisible=function(p){if(p.type==='netdealer'){const d=DEALER_ROSTER[p.i];return !!d&&!dealerLow(ensureEmpire(),d.id,absNow());}return netVisible(p);};
 // ---- Cheap production visual: a worker per slot with a rack or bench prop ----
 const SLOT_OFFSETS=[[-3.2,-2.4],[3.2,-2.4],[-3.2,2.6],[3.2,2.6],[0,-4.2],[0,4.4]];
 function crewFigure(i){if(NET.crew[i])return NET.crew[i];const g=figure(0,0,[0x6a8f45,0x547f80,0x9b6aa8,0xc47b45,0x4f8fbf,0xb0572f][i%6],0xd2a27c,0x3e3428,.95);
  const rack=new THREE.Group();scene.add(rack);box(0,.5,0,.9,1,.45,0x5d4b3a,false,rack);for(let k=0;k<3;k++)box(-.28+k*.28,1.08,0,.2,.18,.2,0x7cc35b,false,rack);
  const benchP=new THREE.Group();scene.add(benchP);box(0,.45,0,1.1,.9,.55,0xb9a17e,false,benchP);for(let k=0;k<4;k++)box(-.38+k*.25,.94,0,.12,.08,.12,[0xff6f8a,0xffd36b,0x8be0a4,0x9bb8ff][k],false,benchP);
  return NET.crew[i]={g,rack,bench:benchP};}
 function netVisuals(t){
  const e=s.empire;if(!e)return;const now=absNow(),inGame=active&&net.role!=='guest'&&!window.__storyBusy?.();
  for(const d of DEALER_ROSTER){const a=NET.actors[d.id],p=NET.spots[d.id],near=Math.hypot(player.x-p.x,player.z-p.z)<90;
   const on=inGame&&near&&!dealerLow(e,d.id,now)&&(!!e.dealers[d.id]||lvl()>=d.unlock-1);a.g.visible=on;a.stall.visible=on;
   if(on){a.g.position.y=Math.abs(Math.sin(t*1.6+d.leg))*.03;if(a.g.userData.right)a.g.userData.right.rotation.x=e.dealers[d.id]&&stockTotal(e.dealers[d.id].stock)?-.5+Math.sin(t*2)*.25:0;}}
  const h=HOMES[s.house]||HOMES[0],home=(s.house||s.room)&&inGame;
  for(let i=0;i<Math.max(NET.crew.length,e.crew.length);i++){const c=e.crew[i],f=c?crewFigure(i):NET.crew[i];if(!f)continue;
   const o=SLOT_OFFSETS[i%SLOT_OFFSETS.length],x=h.x+o[0],z=h.z+o[1],show=!!c&&home&&Math.hypot(player.x-x,player.z-z)<45;
   f.g.visible=show;f.rack.visible=show&&c.role==='grower';f.bench.visible=show&&c.role==='bench';if(!show)continue;
   const prop=c.role==='grower'?f.rack:f.bench,busy=/Growing|Packing/.test(c.status);prop.position.set(x,0,z+.75);f.g.position.set(x,busy?Math.abs(Math.sin(t*3+i))*.05:0,z);f.g.rotation.y=0;
   const u=f.g.userData;if(u.left&&u.right){u.left.rotation.x=busy?-.9+Math.sin(t*5+i)*.35:0;u.right.rotation.x=busy?-.9-Math.sin(t*5+i)*.35:0;}}
  // Runners show up at the hand-off ends of a trip: leaving home, and at the dealer's stall.
  const run=Object.entries(e.runners).find(([,x])=>x.state!=='idle')||Object.entries(e.runners)[0];
  if(run&&!NET.runner)NET.runner=figure(0,0,0x3bb3a1,0xc68d6a,0x2a2a2a,.9);
  if(NET.runner){let pos=null;if(run&&inGame){const [,x]=run,f=x.legTotal?x.leg/x.legTotal:0,dp=x.target&&NET.spots[x.target],door=STORY_HOME();
    if(x.state==='out'&&dp&&f<.25)pos={x:dp.x+1.6+f*12,z:dp.z+1.2};else if(x.state==='back'&&dp&&f>.8)pos={x:dp.x+1.6+(1-f)*12,z:dp.z+1.2};
    else if(x.state==='out'&&f>.85)pos={x:door.x+1.5,z:door.z+1+(1-f)*14};else if(x.state==='back'&&f<.15)pos={x:door.x+1.5,z:door.z+1+f*14};
    else if(x.state==='idle')pos={x:door.x+1.6,z:door.z+1.4};}
   NET.runner.visible=!!pos&&Math.hypot(player.x-pos.x,player.z-pos.z)<70;if(pos){NET.runner.position.set(pos.x,0,pos.z);NET.runner.position.y=x2bob(t);}}
 }
 const x2bob=t=>Math.abs(Math.sin(t*6))*.05;
 const STORY_HOME=()=>{const h=HOMES[s.house]||HOMES[0];return {x:h.x,z:h.z+h.d/2+1};};
 // ---- Actions (phone + in person) ----
 const money=n=>cash(Math.round(n));
 const avail=t=>Math.max(0,(s.packs[t]||0)-reservedQty(t));
 const nearDealer=id=>{const p=NET.spots[id];return p&&Math.hypot(player.x-p.x,player.z-p.z)<=4;};
 function pay(cost,label){if(!spend(cost))return false;record?.(label,-cost);return true;}
 const A={
  recruit(id){const e=ensureEmpire(),d=dealerOf(id),r=recruitDealer(e,id,{level:lvl(),cash:availableMoney()});if(!r.ok){toast(r.reason);return false;}if(!pay(r.cost,'Dealer signing · '+d.name)){delete e.dealers[id];return false;}toast('🤝 '+d.name+' joins the Sweet Network. Stock them up and they sell while you’re away.');save();return true;},
  assign(id){const e=ensureEmpire(),x=e.dealers[id];if(!x)return false;const c=districtCustomers(id).find(c=>!x.customers.includes(c.id));if(!c||!assignCustomer(e,id,c.id)){toast('Customer list is full for '+dealerOf(id).name);return false;}toast(c.name+' now buys from '+dealerOf(id).name.split(' ')[0]+'.');save();return true;},
  unassign(id){const e=ensureEmpire(),x=e.dealers[id];if(!x||x.customers.length<=1)return false;unassignCustomer(e,id,x.customers[x.customers.length-1]);save();return true;},
  focus(id){const x=ensureEmpire().dealers[id];if(!x)return -1;const opts=[-1,...STRAINS.map((p,t)=>t).filter(t=>t<BASE_COUNT?STRAINS[t].level<=lvl():(s.knownRecipes||{})[STRAINS[t].recipeKey])];x.strain=opts[(opts.indexOf(x.strain)+1)%opts.length];save();return x.strain;},
  target(id,delta){const x=ensureEmpire().dealers[id],d=dealerOf(id);if(!x)return 0;x.target=Math.max(2,Math.min(d.stockCap,x.target+delta));save();return x.target;},
  restock(id,force=false){const e=ensureEmpire(),d=dealerOf(id);if(!e.dealers[id])return 0;if(!force&&!nearDealer(id)){toast('Visit '+d.name+' in '+d.district+' or send a runner.');return 0;}
   const order=s.packs.map((n,t)=>t).sort((a,b)=>value(b)-value(a));let n=0;for(const t of order){const tmp=[];tmp[t]=avail(t);const got=restockDealer(e,id,tmp,t,tmp[t]);s.packs[t]-=got;n+=got;}
   toast(n?'Handed '+n+' packs to '+d.name.split(' ')[0]+'.':'No free packs in your bag (agreed deals are kept back).');save();return n;},
  collect(id,force=false){const e=ensureEmpire(),d=dealerOf(id);if(!force&&!nearDealer(id)){toast('Collect in person or send a runner.');return 0;}const c=collectDealer(e,id);if(c){s.cash+=c;s.earned+=c;}toast(c?'Collected '+money(c)+' from '+d.name.split(' ')[0]+'.':'Nothing to collect yet.');save();return c;},
  hireRunner(id){const e=ensureEmpire(),r=hireRunner(e,id,{level:lvl(),cash:availableMoney()});if(!r.ok){toast(r.reason);return false;}if(!pay(r.cost,'Runner signing · '+runnerOf(id).name)){delete e.runners[id];return false;}toast('🚲 '+runnerOf(id).name+' will carry stockroom packs out and bring the takings home.');save();return true;},
  auto(id){const x=ensureEmpire().runners[id];if(!x)return false;x.auto=!x.auto;save();return x.auto;},
  send(id,dealer){const e=ensureEmpire();dealer=dealer||Object.keys(e.dealers).find(k=>!dealerLow(e,k,absNow()));if(!dealer)return false;const ok=dispatchRunner(s,id,dealer,t=>value(t));toast(ok?runnerOf(id).name.split(' ')[0]+' is off to '+dealerOf(dealer).name.split(' ')[0]+'.':'That runner is already out.');save();return ok;},
  hireCrew(role){const e=ensureEmpire(),r=hireCrew(e,{role,level:lvl(),cash:availableMoney(),house:s.house});if(!r.ok){toast(r.reason);return false;}if(!pay(r.cost,'Crew signing · '+role)){e.crew.pop();return false;}toast(role==='grower'?'🌱 A grower takes a slot. Seeds come out of your wallet.':'🧑‍🍳 A bench hand takes a slot. Keep wrappers and raw stock handy.');save();return true;},
  crewStrain(i){const c=ensureEmpire().crew[i];if(!c)return -1;const opts=c.role==='grower'?[-1,...STRAINS.slice(0,BASE_COUNT).map((p,t)=>t).filter(t=>STRAINS[t].level<=lvl())]:[-1,...STRAINS.map((p,t)=>t).filter(t=>t<BASE_COUNT||(s.knownRecipes||{})[STRAINS[t].recipeKey])];c.strain=opts[(opts.indexOf(c.strain)+1)%opts.length];save();return c.strain;},
  crewToggle(i){const c=ensureEmpire().crew[i];if(!c)return false;c.on=!c.on;save();return c.on;},
  fire(i){const ok=fireCrew(ensureEmpire(),i);if(ok){toast('Crew member let go. No hard feelings, just gummies.');save();}return ok;},
  buySlot(){const e=ensureEmpire(),r=buySlot(e,{house:s.house,cash:availableMoney()});if(!r.ok){toast(r.reason);return false;}if(!pay(r.cost,'Workshop slot')){e.slotsBought--;return false;}toast('🔧 New work slot fitted.');save();return true;},
  tab(t){NET.tab=t;menu('sweetnet');}
 };
 window.netAct=(k,...a)=>{const r=A[k]?.(...a);if(['sweetnet','netdealer'].includes(panel))menu(panel,panel==='netdealer'?NET.open:undefined);return r;};
 // ---- Phone app ----
 const pct=(a,b)=>Math.round(Math.max(0,Math.min(1,b?a/b:0))*100);
 const strainName=t=>t<0?'Best in stock':STRAINS[t]?.name||'?';
 function dealerCard(d,detail=false){const e=ensureEmpire(),x=e.dealers[d.id],now=absNow();
  if(!x){const can=lvl()>=d.unlock;return '<div class="net-card locked"><div class="net-row"><b>'+d.name+'</b><small>'+d.district+'</small></div><p>“'+d.line+'”</p><p class="net-meta">Cut '+Math.round(d.cut*100)+'% · up to '+d.cap+' customers · shelf '+d.stockCap+'</p><button '+(can?'':'disabled ')+'onclick="netAct(\'recruit\',\''+d.id+'\')">'+(can?'Recruit · '+money(d.fee):'🔒 Level '+d.unlock)+'</button></div>';}
  const low=dealerLow(e,d.id,now),st=stockTotal(x.stock),here=nearDealer(d.id),fc=dealerForecast(e,d.id,t=>value(t));
  const status=low?'🚨 Laying low until Day '+Math.floor(x.lowUntil/1440)+' '+String(Math.floor(x.lowUntil%1440/60)).padStart(2,'0')+':00':st?'Selling · '+st+' packs on the shelf':'⚠ Out of stock';
  let h='<div class="net-card'+(low?' low':'')+'"><div class="net-row"><b>'+d.name+'</b><small>'+d.district+'</small></div><p class="net-status">'+status+'</p>'+
   '<div class="net-bar"><i style="width:'+pct(st,d.stockCap)+'%"></i><em style="left:'+pct(x.target,d.stockCap)+'%"></em></div>'+
   '<p class="net-meta">Owed <b>'+money(x.owed)+'</b> · cut '+Math.round(d.cut*100)+'% · sold '+x.sold+' · ≈'+money(fc)+'/day</p>'+
   '<p class="net-meta">Customers '+x.customers.length+'/'+d.cap+' · focus '+strainName(x.strain)+' · restock to '+x.target+(x.shorted?' · <span class="warn">shortchanged '+money(x.shorted)+'</span>':'')+'</p>'+
   '<div class="net-btns"><button onclick="netAct(\'assign\',\''+d.id+'\')"'+(x.customers.length>=d.cap?' disabled':'')+'>+ Customer</button><button onclick="netAct(\'unassign\',\''+d.id+'\')">− Customer</button><button onclick="netAct(\'focus\',\''+d.id+'\')">Focus ↻</button><button onclick="netAct(\'target\',\''+d.id+'\',-2)">−</button><button onclick="netAct(\'target\',\''+d.id+'\',2)">+</button>'+
   (here?'<button class="go" onclick="netAct(\'restock\',\''+d.id+'\')">Restock from bag</button><button class="go" onclick="netAct(\'collect\',\''+d.id+'\')">Collect '+money(x.owed)+'</button>':'<button onclick="__net.track(\''+d.id+'\')">Show me the way →</button>')+'</div></div>';
  return h;}
 function runnerCard(r){const e=ensureEmpire(),x=e.runners[r.id];
  if(!x){const can=lvl()>=r.unlock;return '<div class="net-card locked"><div class="net-row"><b>'+r.name+'</b><small>carries '+r.capacity+'</small></div><p class="net-meta">'+money(r.trip)+' per round trip, taken from the takings</p><button '+(can?'':'disabled ')+'onclick="netAct(\'hireRunner\',\''+r.id+'\')">'+(can?'Hire · '+money(r.fee):'🔒 Level '+r.unlock)+'</button></div>';}
  const where=x.state==='idle'?'Waiting at your base':x.state==='out'?'Heading to '+dealerOf(x.target).name.split(' ')[0]+' with '+stockTotal(x.cargo)+' packs':'Coming home with '+money(x.cash);
  return '<div class="net-card"><div class="net-row"><b>'+r.name+'</b><small>'+x.trips+' trips</small></div><p class="net-status">'+where+'</p>'+(x.state!=='idle'?'<div class="net-bar run"><i style="width:'+(100-pct(x.leg,x.legTotal))+'%"></i></div>':'')+
   '<div class="net-btns"><button onclick="netAct(\'auto\',\''+r.id+'\')">'+(x.auto?'Auto restock: ON':'Auto restock: OFF')+'</button>'+(x.state==='idle'?'<button class="go" onclick="netAct(\'send\',\''+r.id+'\')">Send now</button>':'')+'</div></div>';}
 function crewHTML(){const e=ensureEmpire(),slots=crewSlots(e,s.house),up=slotUpgradeCost(e);
  let h='<p class="net-meta">'+(WORKSHOP_NAMES?.[s.house]||'Your base')+' · <b>'+e.crew.length+'/'+slots+'</b> work slots · shift 8 AM–8 PM · wages at midnight (grower '+money(CREW.wage.grower)+', bench '+money(CREW.wage.bench)+')</p>';
  e.crew.forEach((c,i)=>{h+='<div class="net-card"><div class="net-row"><b>'+(c.role==='grower'?'🌱 Grower':'🧑‍🍳 Bench hand')+' #'+(i+1)+'</b><small>'+strainName(c.strain)+'</small></div><p class="net-status">'+(c.status||'Starting shift')+'</p><div class="net-btns"><button onclick="netAct(\'crewStrain\','+i+')">Product ↻</button><button onclick="netAct(\'crewToggle\','+i+')">'+(c.on?'Pause':'Resume')+'</button><button onclick="netAct(\'fire\','+i+')">Let go</button></div></div>';});
  if(lvl()<CREW.unlock)h+='<div class="net-card locked"><p>🔒 Production crew unlocks at level '+CREW.unlock+'.</p></div>';
  else if(e.crew.length<slots)h+='<div class="net-btns wide"><button class="go" onclick="netAct(\'hireCrew\',\'grower\')">Hire grower · '+money(CREW.hire)+'</button><button class="go" onclick="netAct(\'hireCrew\',\'bench\')">Hire bench hand · '+money(CREW.hire)+'</button></div>';
  h+=up!=null?'<div class="net-btns wide"><button onclick="netAct(\'buySlot\')"'+(s.house<1?' disabled':'')+'>'+(s.house<1?'🔒 Extra slots need a bigger place':'Add a work slot · '+money(up))+'</button></div>':'<p class="net-meta">All extra slots built.</p>';
  return h+'<p class="net-meta">Stockroom '+storedUsed()+'/'+storageCapacity()+' packs · wrappers '+(s.wrappers||0)+'</p>';}
 function sweetNetHTML(){const e=ensureEmpire(),owed=Object.values(e.dealers).reduce((a,x)=>a+x.owed,0),st=e.stats;
  let h='<div class="overline">SWEET NETWORK</div><h2>Your candy empire</h2><p class="net-sum"><span><b>'+money(owed)+'</b>owed</span><span><b>'+Object.keys(e.dealers).length+'</b>dealers</span><span><b>'+e.crew.length+'</b>crew</span><span><b>'+storedUsed()+'</b>in stock</span></p>';
  h+='<div class="net-tabs">'+[['dealers','Dealers'],['runners','Runners'],['crew','Crew'],['log','Log']].map(([k,l])=>'<button class="'+(NET.tab===k?'on':'')+'" onclick="netAct(\'tab\',\''+k+'\')">'+l+'</button>').join('')+'</div>';
  if(NET.tab==='dealers')h+=DEALER_ROSTER.map(d=>dealerCard(d)).join('');
  else if(NET.tab==='runners')h+='<p class="net-meta">Runners load packs from your stockroom, restock dealers below their target and bring the takings home.</p>'+RUNNER_ROSTER.map(runnerCard).join('');
  else if(NET.tab==='crew')h+=crewHTML();
  else h+='<ol class="net-log">'+(e.log.slice(-10).reverse().map(l=>'<li class="'+l.kind+'"><small>Day '+Math.floor(l.at/1440)+' '+String(Math.floor(l.at%1440/60)).padStart(2,'0')+':'+String(l.at%60).padStart(2,'0')+'</small> '+l.text+'</li>').join('')||'<li>Nothing yet. Recruit a dealer to get started.</li>')+'</ol><p class="net-meta">Lifetime: '+st.dealerSales+' packs via dealers · '+money(st.dealerNet)+' to you · cuts '+money(st.cuts)+' · wages '+money(st.wages)+' · confiscated '+st.seized+'</p>';
  return h;}
 const netMenu=menu;menu=function(which,data){netMenu(which,data);
  if(which==='sweetnet'&&panel==='sweetnet'){netRun();$('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Close">×</button><div class="story-phone net-phone">'+sweetNetHTML()+'</div><button class="phone-home-button" onclick="phoneHome()" aria-label="Phone home">▰</button>';$('overlay').classList.toggle('phone',true);}
  if(which==='netdealer'&&panel==='netdealer'){NET.open=data;const d=DEALER_ROSTER[data];if(!d)return;netRun();const x=ensureEmpire().dealers[d.id];
   $('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Close">×</button><div class="overline">SWEET NETWORK / '+d.district.toUpperCase()+'</div><h2>'+d.name+'</h2>'+(x?'':'<div class="message">“'+d.line+'”</div>')+'<div class="net-phone story-phone net-inline">'+dealerCard(d)+'</div>';}
 };window.menu=menu;
 const netPhoneHome=phoneHome;phoneHome=function(){netPhoneHome();if(panel!=='phone')return;const e=ensureEmpire(),owed=Object.values(e.dealers).reduce((a,x)=>a+x.owed,0),n=Object.keys(e.dealers).length;
  const card='<button class="story-phone-card net-phone-card" onclick="menu(\'sweetnet\')"><b>🍬 SWEET NETWORK</b><strong>'+(n?n+' dealer'+(n>1?'s':'')+' · '+money(owed)+' owed':lvl()>=DEALER_ROSTER[0].unlock?'Recruit your first dealer':'Dealers unlock at level '+DEALER_ROSTER[0].unlock)+'</strong><small>'+(e.crew.length?e.crew.length+' crew working · ':'')+storedUsed()+' packs in the stockroom</small></button>';
  const after=$('modal').querySelector?.('.story-phone-card')||$('modal').querySelector?.('.phone-app-grid');if(after)after.insertAdjacentHTML('afterend',card);else $('modal').insertAdjacentHTML?.('beforeend',card);};window.phoneHome=phoneHome;
 const netUpdate=update;update=function(dt){netUpdate(dt);NET.timer+=dt;if(NET.timer>=.5){NET.timer=0;if(!window.__storyBusy?.())netRun();}netVisuals(performance.now()/1000);};
 const netLoad=load;load=function(...args){netLoad(...args);if(s.empire){s.empire=normalizeEmpire(s.empire,{clock:absNow(),strainCount:STRAINS.length});Object.defineProperty(s.empire,'_ok',{value:true,enumerable:false});}};window.loadGame=load;
 window.__net={state:()=>JSON.parse(JSON.stringify(ensureEmpire())),act:(k,...a)=>A[k]?.(...a),tick:()=>netRun(),
  // QA/debug: jump the network clock forward without touching your own day.
  advance:minutes=>{const e=ensureEmpire();e.clock=Math.max(0,e.clock-Math.max(0,minutes|0));return netRun();},
  spot:id=>NET.spots[id],track:id=>{const p=NET.spots[id];if(!p)return false;track={x:p.x,z:p.z,label:dealerOf(id).name};close();toast('Tracking '+dealerOf(id).name);return true;},
  visuals:()=>({dealers:Object.fromEntries(DEALER_ROSTER.map(d=>[d.id,NET.actors[d.id].g.visible])),crew:NET.crew.filter(f=>f.g.visible).length,runner:!!NET.runner?.visible,runnerAt:NET.runner?[NET.runner.position.x,NET.runner.position.z]:null}),
  html:()=>sweetNetHTML(),
  // QA/screenshot staging: a stocked late-game network, and a standing spot facing a dealer or the crew.
  stage:()=>{s.room=true;s.xp=Math.max(s.xp,600);s.cash=Math.max(s.cash,30000);s.heat=Math.min(s.heat||0,20);const e=ensureEmpire();
   for(const d of DEALER_ROSTER){if(!e.dealers[d.id])A.recruit(d.id);for(let k=0;k<d.cap;k++)if(!A.assign(d.id))break;for(let t=0;t<BASE_COUNT;t++)s.packs[t]=Math.max(s.packs[t],8);A.restock(d.id,true);}
   for(const r of RUNNER_ROSTER)if(!e.runners[r.id])A.hireRunner(r.id);if(!e.crew.length)A.hireCrew('bench');for(let t=0;t<BASE_COUNT;t++)s.storedPacks[t]=Math.max(s.storedPacks[t],10);
   const c=e.crew[0];if(c)c.strain=0;netRun();close();return {dealers:Object.keys(e.dealers).length,runners:Object.keys(e.runners).length,crew:e.crew.length};},
  look:(x,z,from=6,side=0)=>{const p={x,z},d=Math.hypot(player.x-x,player.z-z)||1;player.x=x+from*Math.cos(side);player.z=z+from*Math.sin(side);yaw=Math.atan2(-(x-player.x),-(z-player.z));pitch=-.08;return {x:player.x,z:player.z,yaw};},
  crewSpot:()=>{const h=HOMES[s.house]||HOMES[0],o=SLOT_OFFSETS[0];return {x:h.x+o[0],z:h.z+o[1]};}};
 window.loadGame=load;
}catch(error){console.warn('Sweet Network unavailable',error);}
// v143 playtest/feel QA hook. Read-only state plus test helpers; never used by gameplay.
try{
 window.__feel={
  state:()=>({x:+player.x.toFixed(3),z:+player.z.toFixed(3),eye:+player.y.toFixed(4),cam:+camera.position.y.toFixed(4),ground:+floorHeight(player.x,player.z).toFixed(3),fov:+camera.fov.toFixed(2),vx:+locomotion.x.toFixed(3),vz:+locomotion.z.toFixed(3),speed:+Math.hypot(locomotion.x,locomotion.z).toFixed(3),jump:+locomotion.jump.toFixed(4),crouch:+locomotion.crouch.toFixed(3),stamina:+stamina.toFixed(1),yaw:+yaw.toFixed(3),pitch:+pitch.toFixed(3),walk,driving,driveSpeed:+driveSpeed.toFixed(3),driveSteer:+driveSteer.toFixed(3),stepEye:+(locomotion.stepEye||0).toFixed(4),driveAngle:+driveAngle.toFixed(3),panel,active,day:s?.day,time:s?.time,prompt:$('prompt')?.style.display!=='none'?($('prompt')?.innerText||''):''}),
  place:(x,z,h=yaw,p=0)=>{player.x=x;player.z=z;yaw=h;pitch=p;Object.assign(locomotion,{x:0,z:0,jump:0,vertical:0});syncPlayerView();return [player.x,player.z];},
  van:()=>{if(!s)return null;s.vehicleOwned=true;const pose=vehiclePose;const door=vehicleDoorAccess(pose,null,blocked,floorHeight);if(door){player.x=door.x;player.z=door.z;syncPlayerView();}enterVehicle();return {driving,door:!!door,pose:{...pose}};},
  leave:()=>{driveSpeed=0;exitVehicle();return driving;},
  spec:()=>({...activeFleet(s)}),
  // Deterministic fixed-step playthrough: hold `input` keys for `frames` steps of `dt`, record state each step.
  sim:(input={},frames=60,dt=1/60,every=1)=>{const saved=keys,out=[];try{for(let i=0;i<frames;i++){keys={...input};update(dt);if(i%every===0)out.push({i,...window.__feel.state()});}}finally{keys=saved;}return out;},
  floor:(x,z)=>floorHeight(x,z),blocked:(x,z)=>!!blocked(x,z),
  vanAt:(x,z,angle=0)=>{if(!s)return null;s.vehicleOwned=true;if(driving){driveSpeed=0;exitVehicle();}vehiclePose={x,z,angle};return window.__feel.van();},
  colliders:(x,z,r=12)=>colliders.filter(c=>Math.abs(c.x-x)<r&&Math.abs(c.z-z)<r).slice(0,40).map(c=>[+c.x.toFixed(2),+c.z.toFixed(2),+c.w.toFixed(2),+c.d.toFixed(2)])
 };
}catch(error){console.warn('Feel QA hook unavailable',error);}

// ── v145 Wheels & Weather ──────────────────────────────────────────────────────────────
// Lucky Lou's used-car lot, arcade handling (weight, drift, handbrake), a leaning chase camera,
// engine and tyre audio, skid marks, trunk stock, Sugar Squad cruisers, and the seeded rain.
try{
 const CAR={sim:null,cam:null,view:'chase',engine:null,skids:null,skidClock:0,lot:null,lotColliders:[],cruisers:[],cruiserMeshes:[],cruiserSeen:false,pull:0,lastHit:0,sirenClock:0,shake:0,forceRain:null,lastRain:0,rainAudio:null};
 try{CAR.view=localStorage.getItem('gummybay-car-cam')==='fp'?'fp':'chase';}catch{}
 const qk=()=>quality==='performance'?'low':quality==='high'?'high':'medium';
 const carState=()=>{if(!Array.isArray(s.lotCars))s.lotCars=[];s.lotCars=s.lotCars.filter(id=>!!lotCar(id));if(typeof s.carSel!=='string'||(s.carSel&&!lotOwned(s,s.carSel)))s.carSel='';if(!s.trunk||typeof s.trunk!=='object'||Array.isArray(s.trunk))s.trunk={};return s;};
 const activeCarSpec=()=>{carState();return s.carSel?lotCar(s.carSel):activeFleet(s);};
 const activeHandling=()=>handlingFor(activeCarSpec());
 const unsold=()=>{carState();return LOT_CARS.filter(c=>!s.lotCars.includes(c.id)).map(c=>c.id);};
 const strainName=t=>STRAINS[t]?.name||('Strain '+t);

 // The lot: one merged mesh, hidden beyond 95 m so it never costs a draw call on main street.
 CAR.lot=createLot(scene,LOT_CARS.map(c=>c.id));
 function refreshLot(){const list=unsold();CAR.lot.refresh(list);for(const c of CAR.lotColliders){const i=colliders.indexOf(c);if(i>=0)colliders.splice(i,1);}CAR.lotColliders=lotColliders(list);colliders.push(...CAR.lotColliders);}
 refreshLot();
 addPoint('lot',LOT_SITE.label,LOT_DOOR.x,LOT_DOOR.z);
 CAR.lotModels=createLotModels();playerVan.add(CAR.lotModels.group);
 CAR.skids=createSkidMarks(scene,qk()==='low'?60:qk()==='high'?200:120);
 const nearLot=()=>Math.hypot(player.x-LOT_DOOR.x,player.z-LOT_DOOR.z)<7;
 // Puts a freshly chosen car on the lot apron, ready to drive off.
 function deliverToLot(){for(const [x,z,a] of [[LOT_SITE.x-2,LOT_SITE.z-11.5,Math.PI/2],[LOT_SITE.x+6,LOT_SITE.z-11.5,Math.PI/2],[LOT_SITE.x-10,LOT_SITE.z-12,Math.PI/2],[LOT_SITE.x+2,LOT_SITE.z-1,Math.PI]])if(vehicleClear(x,z,a)){vehiclePose={x,z,angle:a};if(net.role!=='guest')s.vehiclePark={...vehiclePose};return true;}return false;}

 const wheelsCommit=doAction;doAction=function(k,a,b,c){
  if(!['buyLot','selectLot','trunkLoad','trunkUnload'].includes(k)){wheelsCommit(k,a,b,c);return;}
  if(!active||ensurePolice().search)return;
  carState();
  if(k==='buyLot'||k==='selectLot'){
   if(driving){toast('Park before swapping cars.');return;}
   if(!processingRemote&&!nearLot()){toast('Walk up to Lou’s office to do business.');return;}
   if(k==='selectLot'&&a===''){s.carSel='';save();if(!processingRemote)menu('lot');return;}
   const req=lotRequest(s,a,k==='selectLot');if(!req.ok){toast(req.reason);return;}
   if(k==='buyLot'){if(!spend(req.car.price))return;s.lotCars=[...new Set([...s.lotCars,a])];refreshLot();toast('Lou hands you the keys to the '+req.car.name+'. “No refunds, no questions.”');}
   s.carSel=a;deliverToLot();save();if(!processingRemote)menu('lot');return;
  }
  // Trunk: load or unload packs while standing by your parked car, or sitting in it stopped.
  const t=Number(a),qty=Math.max(1,Math.floor(Number(b)||1));
  if(!Number.isInteger(t)||t<0||t>=STRAINS.length)return;
  if(!trunkReach()){toast('Stand by your car to use the trunk.');return;}
  const cap=trunkCapacity(activeHandling()),moved=moveTrunk(s.packs,s.trunk,{type:t,qty,toTrunk:k==='trunkLoad',capacity:cap});
  if(!moved.moved){toast(k==='trunkLoad'?(trunkCount(s.trunk)>=cap?'The trunk is full.':'No '+strainName(t)+' packs to load.'):'Nothing like that in the trunk.');return;}
  s.packs=moved.packs;s.trunk=moved.trunk;save();if(!processingRemote)menu('trunk');
 };ACTION_NAMES.push('buyLot','selectLot','trunkLoad','trunkUnload');
 function trunkReach(){if(!s.vehicleOwned)return false;if(driving)return Math.abs(driveSpeed)<1;const back={x:vehiclePose.x-Math.sin(vehiclePose.angle)*2.6,z:vehiclePose.z-Math.cos(vehiclePose.angle)*2.6};return Math.hypot(player.x-back.x,player.z-back.z)<3.2||Math.hypot(player.x-vehiclePose.x,player.z-vehiclePose.z)<3.4;}
 function carLine(car){return car.blurb+' Level '+car.level+' · '+Math.round(car.top*3.6)+' km/h · trunk '+car.trunk+' packs · '+(car.mass>1.5?'heavy':car.mass<.8?'featherweight':'mid-weight')+(car.drift>1.1?', loves to slide':'')+'.';}
 const wheelsMenu=menu;menu=function(which,data){wheelsMenu(which,data);
  if(which==='lot'&&panel==='lot'){carState();const current=activeCarSpec();
   let h='<button class="close" onclick="closeMenu()">×</button><div class="overline">LUCKY LOU’S PRE-LOVED MOTORS</div><h2>“Every car comes with a full tank and a story.”</h2><p>Driving: '+esc(current.name)+'. Pay by '+(s.payment==='card'?'card':'cash')+'. Your pick is waiting out front on the apron.</p>'+(s.vehicleOwned?'':'<p class="note">Lou only deals with registered drivers. Buy the Harbor Motors van first.</p>');
   for(const car of LOT_CARS){const owned=lotOwned(s,car.id),sel=s.carSel===car.id,req=lotRequest(s,car.id);h+=row(car.name,carLine(car),sel?'DRIVING':owned?'Drive this':cash(car.price),owned?"action('selectLot','"+car.id+"')":"action('buyLot','"+car.id+"')",sel||driving||(!owned&&!req.ok));}
   if(s.vehicleOwned)h+=row('Your Harbor Motors vehicle','Switch back to the '+esc(activeFleet(s).name)+'.',s.carSel?'Drive this':'DRIVING',"action('selectLot','')",!s.carSel||driving);
   $('modal').innerHTML=h;}
  if(which==='trunk'&&panel==='trunk'){carState();const spec=activeHandling(),cap=trunkCapacity(spec),used=trunkCount(s.trunk);
   let h='<button class="close" onclick="closeMenu()">×</button><div class="overline">'+esc(spec.name.toUpperCase())+' / TRUNK</div><h2>'+used+' of '+cap+' packs stowed.</h2><p>Packs in the trunk do not count in a body search. If the Sugar Squad pull you over, they take half.</p>';
   STRAINS.forEach((st,t)=>{const bag=s.packs[t]||0,boot=s.trunk[t]||0;if(!bag&&!boot)return;h+='<div class="item"><div><strong>'+esc(st.name)+'</strong><p>'+bag+' carried · '+boot+' in the trunk</p></div><span class="trunk-buttons"><button class="primary" onclick="action(\'trunkLoad\','+t+',1)" '+(bag&&used<cap?'':'disabled')+'>Load</button><button class="ghost" onclick="action(\'trunkLoad\','+t+','+bag+')" '+(bag&&used<cap?'':'disabled')+'>All</button><button class="ghost" onclick="action(\'trunkUnload\','+t+','+boot+')" '+(boot?'':'disabled')+'>Take out</button></span></div>';});
   if(!used&&!s.packs.some(n=>n>0))h+='<p class="note">No packs carried and the trunk is empty.</p>';
   $('modal').innerHTML=h;}
  if(which==='forecast'&&panel==='forecast'){$('modal').innerHTML='<button class="close" onclick="closeMenu()" aria-label="Close">×</button><div class="story-phone weather-phone">'+forecastHTML()+'</div><button class="phone-home-button" onclick="phoneHome()" aria-label="Phone home">▰</button>';$('overlay').classList.toggle('phone',true);}
 };window.menu=menu;

 // Vehicle bodies: lot cars replace the van model on the same parked slot.
 const wheelsSync=syncFleetModel;syncFleetModel=function(root,model){wheelsSync(root,model);if(root!==playerVan)return;if(CAR.lotModels.group.parent!==playerVan)playerVan.add(CAR.lotModels.group);const lot=s.carSel&&lotOwned(s,s.carSel);CAR.lotModels.select(lot?s.carSel:'');if(lot)for(const child of root.children)if(child!==CAR.lotModels.group)child.visible=false;};

 // Entering seeds the physics body; exiting drops the engine.
 const wheelsEnter=enterVehicle;enterVehicle=function(){wheelsEnter();if(driving){CAR.sim=createCar(player.x,player.z,driveAngle);CAR.lastLong=0;CAR.cam=null;CAR.pull=0;toast('W/S drive · A/D steer · Space handbrake · V camera · T trunk · F exit');}};
 const wheelsExit=exitVehicle;exitVehicle=function(){wheelsExit();if(!driving){CAR.sim=null;CAR.engine?.update({on:false});}};
 window.enterVehicle=enterVehicle;window.exitVehicle=exitVehicle;

 carDrive=function(input,dt){
  const h=activeHandling();
  if(!CAR.sim){CAR.sim=createCar(player.x,player.z,driveAngle);CAR.lastLong=0;}
  const c=CAR.sim;if(Math.hypot(c.x-player.x,c.z-player.z)>.01){c.x=player.x;c.z=player.z;}c.angle=driveAngle;
  // Other systems (tests, police stops, replays) may write driveSpeed directly; honour that.
  if(Math.abs(driveSpeed-(CAR.lastLong??0))>1e-6)setLong(c,driveSpeed);
  const prev={x:c.x,z:c.z,angle:c.angle};
  const throttle=(input.w||input.arrowup?1:0)-(input.s||input.arrowdown?1:0),steer=(input.a||input.arrowleft?1:0)-(input.d||input.arrowright?1:0);
  // v144 feel: the wheel winds to lock gradually (steerStep), and stepCar softens turning with speed.
  driveSteer=steerStep(driveSteer,steer,dt);carDriveTop=h.top;
  stepCar(c,{throttle,steer:driveSteer,handbrake:!!input[' ']},h,dt);
  const surface=drivingSurfaceZone({x:c.x,z:c.z,angle:c.angle}),limited=limitVehicleZoneSpeed(c.long,surface,dt);if(limited!==c.long)setLong(c,limited);
  const hit=resolveMove(c,prev,(x,z,a)=>vehicleSweep(x,z,a));
  if(hit!=='free'){const impact=Math.abs(c.long);if(impact>2.5&&now-CAR.lastHit>.35){CAR.lastHit=now;playTone(60,.12,.03);CAR.shake=Math.min(1,impact/14);}}
  player.x=c.x;player.z=c.z;driveAngle=c.angle;driveSpeed=Math.round(c.long*1e6)/1e6;CAR.lastLong=driveSpeed;CAR.throttle=throttle;
  // Skid marks from both rear tyres while sliding or braking hard.
  CAR.skidClock-=dt;if(c.skid>.3&&CAR.skidClock<=0){CAR.skidClock=.05;const fx=Math.sin(c.angle),fz=Math.cos(c.angle),rx=Math.cos(c.angle),rz=-Math.sin(c.angle),moveA=Math.atan2(c.vx,c.vz);for(const side of [-.8,.8]){const x=c.x-fx*1.25+rx*side,z=c.z-fz*1.25+rz*side;CAR.skids.add(x,floorHeight(x,z),z,moveA);}}
 };

 // Police: cruisers join a pursuit while you drive. They feed the same chase ladder as officers on foot.
 const footSees=copSeesPlayer;copSeesPlayer=function(cop){return footSees(cop)||(driving&&CAR.cruiserSeen===true);};
 function cruiserMesh(i){if(CAR.cruiserMeshes[i])return CAR.cruiserMeshes[i];const g=new THREE.Mesh(carGeometry('cruiser'),CAR_MATERIAL);g.name='Sugar Squad cruiser';g.castShadow=true;const bar=new THREE.Mesh(new THREE.BoxGeometry(1.1,.14,.32),new THREE.MeshBasicMaterial({color:0xff3b3b}));bar.position.set(0,1.5,-.2);g.add(bar);g.userData.bar=bar;g.visible=false;scene.add(g);CAR.cruiserMeshes[i]=g;return g;}
 function spawnCruiser(id){const spot=cruiserSpawn({x:player.x,z:player.z},VEHICLE_ROADS,{blocked:(x,z)=>!vehicleClear(x,z,0),heading:driveAngle,avoid:CAR.cruisers.map(c=>c.car)});return spot?createCruiser(spot,id):null;}
 function clearCruisers(){CAR.cruisers=[];CAR.cruiserSeen=false;CAR.pull=0;for(const m of CAR.cruiserMeshes)m.visible=false;}
 function pulledOver(){
  const p=ensurePolice(),warning=penaltyTier(s.day)==='warning';let taken=0;
  if(!warning&&trunkCount(s.trunk)){const out=seizeTrunk(s.trunk);s.trunk=out.trunk;taken=out.seized;}
  driving=false;vehiclePose={x:player.x,z:player.z,angle:driveAngle};if(net.role!=='guest')s.vehiclePark={...vehiclePose};driveSpeed=0;CAR.sim=null;CAR.engine?.update({on:false});
  const door=vehicleDoorAccess(vehiclePose,null,blocked,floorHeight);if(door)player.set(door.x,1.72+floorHeight(door.x,door.z),door.z);
  clearCruisers();toast(warning?'Pulled over. First-day warning: they let you go.':'Pulled over! The Sugar Squad boxed you in'+(taken?' and took '+taken+' packs from the trunk.':'.'));
  performBust();if(p.report)p.report.trunkSeized=taken;
 }
 function stepPoliceCars(dt){
  if(net.role==='guest'||!active){if(CAR.cruisers.length)clearCruisers();return;}
  const p=ensurePolice(),stage=p.chase?.stage||'clear';
  if(!cruisersWanted(stage,driving)||p.search){if(CAR.cruisers.length)clearCruisers();return;}
  const want=cruiserCount(stage,qk());let id=CAR.cruisers.reduce((m,c)=>Math.max(m,c.id+1),0);
  while(CAR.cruisers.length<want){const cr=spawnCruiser(id++);if(!cr)break;CAR.cruisers.push(cr);if(CAR.cruisers.length===1)toast('Sirens. Sugar Squad cruisers are on your tail. Break line of sight to lose them.');}
  const c=CAR.sim||{vx:0,vz:0};
  const res=stepCruisers(CAR.cruisers,{player:{x:player.x,z:player.z,vx:c.vx,vz:c.vz},dt,clear:(x,z,a)=>vehicleClear(x,z,a),sight:(a,b)=>copSight(a,b),playerSpeed:driveSpeed,state:CAR});
  CAR.cruiserSeen=res.seen;CAR.nearest=res.nearest;
  // No foot officer ticked the ladder this frame (a pure car chase): the cruisers drive it, so breaking their line of sight runs the clock out.
  if(!p._squadStepped&&p.chase&&p.chase.stage!=='clear'){p._squadStepped=true;const was=p.chase;p.chase={...stepChase(was,dt,res.seen&&!((was.distracted||0)>0)),distracted:Math.max(0,(was.distracted||0)-dt),backup:was.backup===true};if(p.chase.stage==='clear'){clearSquad(p,'They lost you.');clearCruisers();return;}}
  for(const rid of res.respawn){const i=CAR.cruisers.findIndex(x=>x.id===rid),fresh=spawnCruiser(rid);if(i>=0){if(fresh)CAR.cruisers[i]=fresh;else CAR.cruisers.splice(i,1);}}
  CAR.sirenClock-=dt;if(CAR.sirenClock<=0&&res.nearest<70){CAR.sirenClock=.42;CAR.sirenHigh=!CAR.sirenHigh;playTone(CAR.sirenHigh?880:660,.3,Math.max(.004,.018*(1-res.nearest/70)));}
  if(res.pulled)pulledOver();
 }
 const wheelsUpdate=update;update=function(dt){wheelsUpdate(dt);try{stepPoliceCars(Math.min(.05,dt||0));CAR.skids.update(dt||0);}catch(error){console.warn('Wheels update',error);}};

 // Rain: a seeded schedule drives drops, splashes, puddles, wet sheen, umbrellas and the hiss.
 const wetSurface=(x,z)=>{const inside=r=>Math.abs(x-r.x)<=r.w/2-.6&&Math.abs(z-r.z)<=r.d/2-.6;return VEHICLE_ROADS.some(inside)||PEDESTRIAN_WAYS.some(inside);};
 const RAIN={fx:createRainFX({scene,quality:qk(),floorHeight,wetSurface})};
 {const mats=new Set();scene.traverse(o=>{const m=o.material;if(o.isMesh&&m&&!Array.isArray(m)&&['asphalt','concrete'].includes(m.userData?.gritKind))mats.add(m);});RAIN.fx.addWetMaterials([...mats]);RAIN.wetMats=mats.size;}
 const wheelsQuality=setQuality;setQuality=function(q){wheelsQuality(q);RAIN.fx?.setQuality(qk());};
 try{const f=new URLSearchParams(location.search).get('weather');if(f==='rain')CAR.forceRain=.85;else if(f==='clear')CAR.forceRain=0;}catch{}
 const rainNow=()=>active?(CAR.forceRain!=null?CAR.forceRain:rainAt(s.day,s.time)):0;
 const wetNow=()=>active?(CAR.forceRain!=null?Math.min(1,CAR.forceRain*1.1):wetnessAt(s.day,s.time)):0;
 const umbrellaFor=person=>((person.id*7+3)%3===0)&&!(person.koUntil>now);
 function forecastHTML(){const days=forecast(s.day,5),r=rainNow();
  return '<div class="overline">WEATHER · GUMMY BAY</div><h2>'+(r>.01?'Raining now':days[0].kind==='clear'?'Dry today':'Rain later')+'</h2><p class="wx-now">'+(r>.01?'Roads are slick. Brake early, drift wide.':'Wet roads are slippery for a while after rain.')+'</p><ol class="wx-days">'+days.map((d,i)=>'<li class="wx-'+d.kind+'"><b>'+d.icon+'</b><strong>'+(i===0?'Today':i===1?'Tomorrow':'Day '+d.day)+'</strong><small>'+esc(d.label)+'</small></li>').join('')+'</ol>';}
 const wheelsPhoneHome=phoneHome;phoneHome=function(){wheelsPhoneHome();if(panel!=='phone')return;const today=forecast(s.day,2),r=rainNow();
  const card='<button class="phone-weather" onclick="menu(\'forecast\')" data-weather="'+today[0].kind+'"><b aria-hidden="true">'+(r>.01?'🌧️':today[0].icon)+'</b><strong>'+(r>.01?'Raining now':esc(today[0].label))+'</strong><small>Tomorrow: '+esc(today[1].label)+'</small></button>';
  const html=$('modal').innerHTML,at=html.indexOf('<div class="phone-app-grid">');$('modal').innerHTML=at<0?html+card:html.slice(0,at)+card+html.slice(at);};window.phoneHome=phoneHome;

 // Render: chase camera with turn lean and impact shake, the car body while driving, the lot cull, rain.
 // The chase pose is applied at the last moment, inside renderer.render, so later render wrappers that re-sync the seat view cannot undo it.
 // Low quality in steady rain: the overcast grade already fills the sky, so the ~20 cloud sprites are skipped; rain nets fewer draw calls than a dry day.
 function overcastClouds(){if(typeof skyClouds==='undefined'||!skyClouds?.group)return;skyClouds.group.visible=!(quality==='performance'&&CAR.lastRain>.6);}
 function applyChasePose(cam){const q=CAR.chasePose;if(!q||cam!==camera)return;if(driving&&CAR.sim){if(CAR.lotModels&&CAR.lotModels.group.parent!==playerVan)syncFleetModel(playerVan,localFleetModels);playerVan.visible=true;playerVan.position.set(CAR.sim.x,floorHeight(CAR.sim.x,CAR.sim.z),CAR.sim.z);playerVan.rotation.set(0,CAR.sim.angle,CAR.sim.lean*.6);playerVan.updateMatrixWorld(true);}cam.position.set(q.x,q.y,q.z);cam.lookAt(q.lx,q.ly,q.lz);cam.rotateZ(q.roll);cam.updateMatrixWorld();}
 if(renderer&&typeof renderer.render==='function'&&!renderer.__chaseHooked){const baseRender=renderer.render.bind(renderer);renderer.render=function(sc,cam){try{applyChasePose(cam);overcastClouds();}catch{}return baseRender(sc,cam);};renderer.__chaseHooked=true;}
 const wheelsRender=renderFrame;renderFrame=function(){
  const dt=Math.min(.1,Math.max(0,(now-(CAR.lastFrame??now))));CAR.lastFrame=now;
  try{
   const c=CAR.sim;
   if(!(driving&&c&&active))CAR.chasePose=null;
   if(driving&&c&&active){
    CAR.cam=chaseCamera(c,CAR.cam,dt||1/60,{blocked:(x,z)=>blocked(x,z)});CAR.shake=Math.max(0,CAR.shake-dt*2.5);const j=CAR.shake*.12;
    CAR.chasePose=null;
    if(CAR.view==='chase'&&!panel){const ground=floorHeight(c.x,c.z);CAR.chasePose={x:CAR.cam.x+(Math.random()-.5)*j,y:ground+CAR.cam.y+(Math.random()-.5)*j,z:CAR.cam.z,lx:CAR.cam.lookX,ly:ground+CAR.cam.lookY,lz:CAR.cam.lookZ,roll:CAR.cam.roll*1.2};applyChasePose(camera);}
    else if(panel){syncPlayerView();camera.rotation.set(pitch,yaw,0);}
    else camera.rotateZ(CAR.cam.roll*.6);
   }
   CAR.lot.mesh.visible=Math.hypot(camera.position.x-LOT_SITE.x,camera.position.z-LOT_SITE.z)<95;
   CAR.cruisers.forEach((cr,i)=>{const m=cruiserMesh(i);m.visible=true;m.position.set(cr.car.x,floorHeight(cr.car.x,cr.car.z),cr.car.z);m.rotation.set(0,cr.car.angle,cr.car.lean*.5);m.userData.bar.material.color.setHex(Math.floor(now*4+i)%2?0x3b6bff:0xff3b3b);});
   for(let i=CAR.cruisers.length;i<CAR.cruiserMeshes.length;i++)CAR.cruiserMeshes[i].visible=false;
   const rain=rainNow(),wet=wetNow();CAR.lastRain=rain;
   RAIN.stats=RAIN.fx.update({camera,rain,wet,dt,people:streetCrowd?.people||null,umbrellaFor});
   if(typeof audioContext!=='undefined'&&audioContext&&soundEnabled){
    if(!RAIN.audio)RAIN.audio=createRainAudio(audioContext);RAIN.audio.update(rain,{covered:driving});
    if(driving&&!CAR.engine)CAR.engine=createEngineAudio(audioContext);
    CAR.engine?.update({rpm:c?.rpm||900,throttle:CAR.throttle||0,skid:c?.skid||0,on:driving&&active&&!panel});
   }else{RAIN.audio?.update(0);CAR.engine?.update({on:false});}
  }catch(error){if(!CAR.renderWarned){CAR.renderWarned=true;console.warn('Wheels render',error);}}
  wheelsRender();
  if(driving&&CAR.sim&&CAR.view==='chase'&&active){playerVan.visible=true;playerVan.position.set(CAR.sim.x,floorHeight(CAR.sim.x,CAR.sim.z),CAR.sim.z);playerVan.rotation.set(0,CAR.sim.angle,CAR.sim.lean*.6);}
 };

 addEventListener('keydown',e=>{
  if(!active||e.repeat||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
  const k=e.key.toLowerCase();
  if(k==='v'&&driving&&!panel){CAR.view=CAR.view==='chase'?'fp':'chase';try{localStorage.setItem('gummybay-car-cam',CAR.view);}catch{}toast(CAR.view==='chase'?'Chase camera':'Driver’s seat');}
  if(k==='t'&&!panel&&trunkReach()){menu('trunk');}
 });

 // QA and test hooks.
 window.__cars={quality:()=>quality,umbrellaView:(side=6)=>{const ppl=streetCrowd?.people||[];let best=null;for(const q of ppl){if(!umbrellaFor(q))continue;const d=Math.hypot(q.x-player.x,q.z-player.z);if(!best||d<best.d)best={q,d};}if(!best)return null;const q=best.q;let px=q.x+side,pz=q.z+side*.5;for(const [ox,oz] of [[side,side*.5],[-side,side*.5],[side,-side*.5],[-side,-side*.5],[0,side],[0,-side]]){if(!blocked(q.x+ox,q.z+oz)){px=q.x+ox;pz=q.z+oz;break;}}player.set(px,1.72+floorHeight(px,pz),pz);yaw=Math.atan2(-(q.x-px),-(q.z-pz));pitch=-.06;syncPlayerView();return {x:+q.x.toFixed(1),z:+q.z.toFixed(1),n:ppl.length};},clock:m=>{if(Number.isFinite(m))s.time=m;return s.time;},camGap:()=>+Math.hypot(camera.position.x-player.x,camera.position.z-player.z).toFixed(2),look:(y,p=-.08)=>{yaw=y;pitch=p;syncPlayerView();return {x:player.x,z:player.z};},buy:id=>{doAction('buyLot',id);close();return s.lotCars?.slice();},enter:()=>{if(!driving&&window.__cars.toDoor())enterVehicle();return driving;},exit:()=>{if(driving)exitVehicle();return !driving;},give:(t=0,n=6)=>{s.packs[t]=n;return s.packs[t];},tail:(d=9,side=0,face=0)=>{const c=CAR.cruisers[0];if(!c)return false;const a=driveAngle;c.car.x=player.x-Math.sin(a)*d+Math.cos(a)*side;c.car.z=player.z-Math.cos(a)*d-Math.sin(a)*side;c.car.angle=a+face;c.car.vx=c.car.vz=0;return true;},endChase:()=>{clearSquad(ensurePolice(),'');clearCruisers();return true;},calls:()=>{const info=renderer.info;info.autoReset=false;info.reset();try{renderFrame();return {calls:info.render.calls,triangles:info.render.triangles};}finally{info.autoReset=true;}},
  CAR,RAIN,
  spec:()=>activeHandling(),
  state:()=>{const c=CAR.sim;return {driving,car:activeCarSpec().id,speed:+(c?.speed||0).toFixed(2),long:+driveSpeed.toFixed(2),rpm:c?.rpm||0,gear:c?.gear||0,slip:+(c?.slip||0).toFixed(3),drifting:!!c?.drifting,skids:CAR.skids.live,view:CAR.view,trunk:{...s.trunk},trunkCount:trunkCount(s.trunk),cruisers:CAR.cruisers.length,cruiserSeen:CAR.cruiserSeen,pull:+(CAR.pull||0).toFixed(2),lotVisible:CAR.lot.mesh.visible,lotCars:[...(s.lotCars||[])],carSel:s.carSel,x:+player.x.toFixed(2),z:+player.z.toFixed(2),angle:+driveAngle.toFixed(3)};},
  stage:()=>{carState();s.vehicleOwned=true;s.xp=Math.max(s.xp,600);s.cash=Math.max(s.cash,30000);close();player.set(LOT_DOOR.x,1.72+floorHeight(LOT_DOOR.x,LOT_DOOR.z),LOT_DOOR.z-1.2);yaw=0;pitch=-.05;syncPlayerView();return {x:player.x,z:player.z};},
  door:()=>vehicleDoorAccess(vehiclePose,null,blocked,floorHeight),
  toDoor:()=>{const d=vehicleDoorAccess(vehiclePose,null,blocked,floorHeight);if(d)player.set(d.x,1.72+floorHeight(d.x,d.z),d.z);return d;},
  drive:(input,seconds,step=1/30)=>{const old=keys;for(let t=0;t<seconds;t+=step){keys={...input};update(step);}keys=old;return window.__cars.state();},
  pursuit:(stage='pursuit')=>{const p=ensurePolice();p.cooldown=0;p.search=null;p.chase={...spotChase(freshChase(),stage),backup:false};const cop=p.officers.find(o=>(o.ko||0)<=0)||p.officers[0];if(cop){cop.squad=stage;cop.mode='pursuit';cop.target=localPoliceRole();}return p.chase.stage;},
  chase:()=>ensurePolice().chase,
  rain:v=>{CAR.forceRain=v==null?null:Math.max(0,Math.min(1,v));return CAR.forceRain;},
  weather:()=>({rain:rainNow(),wet:wetNow(),stats:{...(RAIN.stats||{})},budget:RAIN.fx.budget,wetMats:RAIN.wetMats,forecast:forecast(s.day,3),today:dayWeather(s.day)}),
  lotRefresh:refreshLot
 };
}catch(error){console.warn('Wheels and weather unavailable',error);}
