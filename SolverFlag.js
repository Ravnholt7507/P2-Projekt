let regions = require('./branch.js');
let fs = require('fs');

let PH_array = [];

let HospitalList = [0,0,0,0,0];
HospitalList[0] = {ID: 0, Region: 0, Navn: 'UniversetsHospital', Address: 'Example', Beds: 10, admitted: 0, eqp: 5, staff: 2}
HospitalList[1] = {ID: 1, Region: 1, Navn: 'Midt Hospital', Address: 'Example', Beds: 10, admitted: 0, eqp: 5, staff: 2}
HospitalList[2] = {ID: 2, Region: 2, Navn: 'Odense Hospital', Address: 'Example', Beds: 10, admitted: 0, eqp: 5, staff: 2}
HospitalList[3] = {ID: 3, Region: 3, Navn: 'Sjalland Hospital', Address: 'Example', Beds: 10, admitted: 0, eqp: 5, staff: 2}
HospitalList[4] = {ID: 4, Region: 4, Navn: 'Koebenhavn Hospital', Address: 'Example', Beds: 10, admitted: 0, eqp: 5, staff: 2}

let TravelTimeList = [];
TravelTimeList[0] = {from_region: 0, To_region: 0, min: 0}
TravelTimeList[1] = {from_region: 0, To_region: 1, min: 1}
TravelTimeList[2] = {from_region: 0, To_region: 2, min: 2}
TravelTimeList[3] = {from_region: 0, To_region: 3, min: 3}
TravelTimeList[4] = {from_region: 0, To_region: 4, min: 4}
TravelTimeList[5] = {from_region: 1, To_region: 0, min: 1}
TravelTimeList[6] = {from_region: 1, To_region: 1, min: 0}
TravelTimeList[7] = {from_region: 1, To_region: 2, min: 2}
TravelTimeList[8] = {from_region: 1, To_region: 3, min: 3}
TravelTimeList[9] = {from_region: 1, To_region: 4, min: 4}
TravelTimeList[10] = {from_region: 2, To_region: 0, min: 5}
TravelTimeList[11] = {from_region: 2, To_region: 1, min: 2}
TravelTimeList[12] = {from_region: 2, To_region: 2, min: 0}
TravelTimeList[13] = {from_region: 2, To_region: 3, min: 1}
TravelTimeList[14] = {from_region: 2, To_region: 4, min: 3}
TravelTimeList[15] = {from_region: 3, To_region: 0, min: 4}
TravelTimeList[16] = {from_region: 3, To_region: 1, min: 3}
TravelTimeList[17] = {from_region: 3, To_region: 2, min: 2}
TravelTimeList[18] = {from_region: 3, To_region: 3, min: 0}
TravelTimeList[19] = {from_region: 3, To_region: 4, min: 1}
TravelTimeList[20] = {from_region: 4, To_region: 0, min: 4}
TravelTimeList[21] = {from_region: 4, To_region: 1, min: 3}
TravelTimeList[22] = {from_region: 4, To_region: 2, min: 2}
TravelTimeList[23] = {from_region: 4, To_region: 3, min: 1}
TravelTimeList[24] = {from_region: 4, To_region: 4, min: 0}

//Checks capacity in hospital
function crowdedness(beds){
    if (beds > 0)
        return 1;
    else
        return 0;
}

function eqp(equip){
  if (equip > 0)
      return 1;
  else
      return 0;
}

function cityToRegion(PatientList, city){
let placeholder = 0;
  for(index in regions.regionCities){
    if(placeholder < regions.regionCities[index].length)
       placeholder = regions.regionCities[index].length;
 }
  for (index in regions.regionCities){
    for(i = 0; i < placeholder; i++){
      if (city == regions.regionCities[index][i])
        PatientList.region = index;
    }
  }
  console.log(PatientList.region)
  return PatientList;
}

// uses traveltimeList to find the shortest route and return the corresponding To_Region for the patient
function travel_Hospital(FromRegion, patient_grade){
    let shortest_route = 500;
    let Prefered_hospital = FromRegion;
    for (index in TravelTimeList){
      TravelTime = TravelTimeList[index]
      if ((TravelTime.from_region == FromRegion) && (TravelTime.min<shortest_route) && (patient_grade != 0)){
        if (crowdedness(HospitalList[TravelTime.To_region].Beds) == 1){
          shortest_route = TravelTime.min;
          Prefered_hospital = TravelTime.To_region;
        }
      }
    }
    if (patient_grade == 0)
       Prefered_hospital = FromRegion
    return Prefered_hospital
}

//Finds and returns a patient index the list, based on region and grading. 
function findPatient(Region, grading, New_Patient_List){
    for(index in New_Patient_List){
      if (New_Patient_List[index].region == Region && New_Patient_List[index].grading == grading && New_Patient_List[index].flag == 0)
        return index;
    }
  return "no";
}

//Admit is called for each new patient. It essentially changes their region to match the most suitable hospital. 
//It also calls itself recursively, if two patients in a region can be swapped. 
//Returns updated patient list.
function Admit(patientObj, New_Patient_List){
  let patientGrade = patientObj.grading;
  let patientRegion = patientObj.region;

  let NewRegion = travel_Hospital(patientRegion, patientGrade)
  patientObj.region = NewRegion;
  // If patient can be replaced with other patient -> find other patient's index.

  let ReplacedPatient = TryReplace(patientRegion, patientGrade, New_Patient_List);
  //Should return patient object, så sætter jeg ReplaceInHospital til dens region property, 
  //Sætter bageefter ellers mangler koden bare at blive kommenteret 
  if(ReplacedPatient != false){

    patientObj.region = ReplacedPatient.region;
    HospitalTracker(patientObj.region, patientGrade, 0)
    New_Patient_List.push(patientObj);
    PH_array.push(patientObj);
    let patientIndex = findPatient(ReplacedPatient.region, ReplacedPatient.grading, New_Patient_List)

    New_Patient_List[patientIndex].flag = 1;
    HospitalTracker(New_Patient_List[patientIndex].region, New_Patient_List[patientIndex].grading, 1);
    Admit(New_Patient_List[patientIndex], New_Patient_List)
    New_Patient_List.splice(patientIndex, 1)
    return New_Patient_List;
  }
  PH_array.push(patientObj);
  HospitalTracker(patientObj.region, patientGrade, 0);
  New_Patient_List.push(patientObj);
  return New_Patient_List;
}

// On a patients way to their prefered hospital, we check each hospital to find replacable patients of lower grade.
// (If yes) Returns the region of that hospital hospital (Otherwise return "no")
function TryReplace(FromRegion, patient_grade, New_Patient_List) {
    let shortest_route = 500;
    let PatientObj = false;
    for (index in TravelTimeList){
      TravelTime = TravelTimeList[index];
      if ((TravelTime.from_region == FromRegion) && (TravelTime.min<shortest_route)){
        if (crowdedness(HospitalList[TravelTime.To_region].Beds) == 0){
          ReplacedPatient = LowestGradePatient(TravelTime.To_region, New_Patient_List);
          if (patient_grade > ReplacedPatient.grading){
            PatientObj = ReplacedPatient;
          }
        }
      }
    }
  return PatientObj;
}

//Returns lowest grade of patient in a region 
function LowestGradePatient(Region, New_Patient_List){
  let ReplacedPatient;
  let placeholder_grading = 5;
  for(index in New_Patient_List){
    if (New_Patient_List[index].grading <= placeholder_grading && New_Patient_List[index].region == Region && New_Patient_List[index].flag == 0){
      ReplacedPatient = New_Patient_List[index]; 
      placeholder_grading = New_Patient_List[index].grading
    }
  }
  return ReplacedPatient;
}

//Changes number of beds/admitted in HospitalLists, when admitting a patient
function HospitalTracker(region, PatientGrade, remove){
  if (remove == 0){
    HospitalList[region].admitted += 1
    if (PatientGrade > 0){
      HospitalList[region].Beds -= 1
    }
    if (PatientGrade == 3)
      HospitalList[region].eqp -= 1
  }
  else if (remove == 1){
    HospitalList[region].admitted -= 1;
    if (PatientGrade > 0){
      HospitalList[region].Beds += 1;
    }
    if (PatientGrade == 3)
      HospitalList[region].eqp += 1;
  }
}

// Runs through all new patients which needs to be admitted (this is the function we call initially)
function BatchPatients(PatientList, city, New_Patient_List){
    cityToRegion(PatientList, city)
     New_Patient_List = Admit(PatientList, New_Patient_List)

    // for(index in HospitalList){
    //     console.log("hospital space = " + HospitalList[index].Beds);
    //     console.log("equipment = " + HospitalList[index].eqp);
    // }
    // console.log(HospitalList[0].admitted)
    // console.log(HospitalList[1].admitted)
    // console.log(HospitalList[2].admitted)
    // console.log(HospitalList[3].admitted)
    // console.log(HospitalList[4].admitted)
 //   console.log(New_Patient_List)

    return New_Patient_List
 }

function Delete_PH_array(){
  PH_array.splice(0, PH_array.length)
}

module.exports = {
BatchPatients,
Admit,
HospitalTracker,
TryReplace,
LowestGradePatient,
findPatient,
travel_Hospital,
crowdedness,
cityToRegion,
HospitalList,
PH_array,
Delete_PH_array,
}

















// let PatientList = [];
// PatientList[0] = {Name: "Jeff", grading: 2, region: 4}
// PatientList[1] = {Name: "Kebab", grading: 2, region: 4},
// PatientList[2] = {Name: "Smurf", grading: 2, region: 4}
// PatientList[3] = {Name: "Egon", grading: 2, region: 4}
// PatientList[4] = {Name: "Andre", grading: 2, region: 3}
// PatientList[5] = {Name: "Jeppe", grading: 3, region: 1}
// PatientList[6] = {Name: "Rune", grading: 3, region: 4}
// PatientList[7] = {Name: "Elle", grading: 3, region: 2}
// PatientList[8] = {Name: "Andrea", grading: 1, region: 2}
// PatientList[9] = {Name: "Ramond", grading: 1, region: 0}
// PatientList[10] = {Name: "Dunnis", grading: 1, region: 0}
// PatientList[11] = {Name: "Jsde", grading: 2, region: 1}

  //   for (index in New_Patient_List){
  //       // convert JSON object to string
  //       const data = JSON.stringify(New_Patient_List[index]); 
  //      // write JSON string to a file
  //      fs.appendFile('user.json', data + "\n", (err) => {
  //        if (err) {
  //            throw err;
  //        }
  //        console.log("JSON data is saved.");
  //    });
  //  }
