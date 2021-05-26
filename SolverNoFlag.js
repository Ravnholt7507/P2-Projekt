let regions = require('./branch.js');
let fs = require('fs');
let HL = require('./SolverFlag');

let PH_array = [];

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

// uses traveltimeList to find the shortest route and return the corresponding To_Region for the patient
function travel_Hospital(FromRegion, patient_grade){
    let shortest_route = 500;
    let Prefered_hospital = FromRegion;
    for (index in TravelTimeList){
      TravelTime = TravelTimeList[index]
      if ((TravelTime.from_region == FromRegion) && (TravelTime.min<shortest_route) && (patient_grade != 0)){
        if (crowdedness(HL.HospitalList[TravelTime.To_region].Beds) == 1){
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
function findPatientIndex(ID, New_Patient_List){
    for(index in New_Patient_List){
      if (New_Patient_List[index].PID == ID)
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
  let ReplacedPatient = false;

  let NewRegion = travel_Hospital(patientRegion, patientGrade)
  patientObj.region = NewRegion;
  // If patient can be replaced with other patient -> find other patient's index.

  if (patientObj.grading != 0)
    ReplacedPatient = TryReplace(patientRegion, patientGrade, New_Patient_List);
  //Should return patient object, så sætter jeg ReplaceInHospital til dens region property, 
  //Sætter bageefter ellers mangler koden bare at blive kommenteret 
  if(ReplacedPatient != false){

    patientObj.region = ReplacedPatient.region;
    HospitalTracker(patientObj.region, patientGrade, 0)
    New_Patient_List.push(patientObj);
    PH_array.push(patientObj);
    let patientIndex = findPatientIndex(ReplacedPatient.PID, New_Patient_List)

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
  let ReplacePatient = {name: "", grading: 0, region: 0, flag: 0, PID: 0}
  for (index in TravelTimeList){
    TravelTime = TravelTimeList[index];
    if ((TravelTime.from_region == FromRegion) && (TravelTime.min<shortest_route)){
      if (crowdedness(HL.HospitalList[TravelTime.To_region].Beds) == 0){
        ReplacePatient = LowestGradePatient(TravelTime.To_region, New_Patient_List);
        if (patient_grade > ReplacePatient.grading) {
          PatientObj = ReplacePatient;
        }
      }
    }
  }
return PatientObj;
}
//Returns lowest grade of patient in a region 
function LowestGradePatient(Region, New_Patient_List){
  let ReplacedPatient = false;
  let placeholder_grading = 5;
  for(index in New_Patient_List){
    if (New_Patient_List[index].grading <= placeholder_grading && New_Patient_List[index].region == Region){
      ReplacedPatient = New_Patient_List[index]; 
      placeholder_grading = New_Patient_List[index].grading
    }
  }
  return ReplacedPatient;
}

//Changes number of beds/admitted in HospitalLists, when admitting a patient
function HospitalTracker(region, PatientGrade, remove){
  if (remove == 0){
      HL.HospitalList[region].admitted += 1
    if (PatientGrade > 0)
      HL.HospitalList[region].Beds -= 1
    if (PatientGrade == 3)
      HL.HospitalList[region].eqp -= 1
  }
  else if (remove == 1){
      HL.HospitalList[region].admitted -= 1;
    if (PatientGrade > 0)
      HL.HospitalList[region].Beds += 1;
    if (PatientGrade == 3)
      HL.HospitalList[region].eqp += 1;
  }
  fs.writeFile('HospitalList.json', JSON.stringify(HL.HospitalList), (err) => {
    if (err)
      throw err;
  });
}


// Runs through all new patients which needs to be admitted (this is the function we call initially)
function BatchPatients(PatientList, New_Patient_List){
  New_Patient_List = Admit(PatientList, New_Patient_List)
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
findPatientIndex,
travel_Hospital,
crowdedness,
PH_array,
Delete_PH_array,
}
