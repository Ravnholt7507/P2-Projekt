let regions = require('./branch.js')
let fs = require('fs');
let CityArr = fs.readFileSync('./Cities.txt').toString().split("\r\n");
let GradingArr = fs.readFileSync('./Grades.txt').toString().split("\r\n");
let NameArr = fs.readFileSync('./Names.txt').toString().split("\r\n");

regions.regionPatients(CityArr, NameArr, GradingArr)


let PatientList = [];


for (index in CityArr){
  
  PatientList[index] = {Name:NameArr[index], grading:GradingArr[index], region:regions.gradeList[index]}
}


let HospitalList = [0,0,0,0,0];
HospitalList[0] = {ID: 0, Region: 0, Navn: 'UniversetsHospital', Address: 'Example', Beds: 150, admitted: 0, eqp: 300}
HospitalList[1] = {ID: 1, Region: 1, Navn: 'Midt Hospital', Address: 'Example', Beds: 150, admitted: 0, eqp: 300}
HospitalList[2] = {ID: 2, Region: 2, Navn: 'Odense Hospital', Address: 'Example', Beds: 150, admitted: 0, eqp: 300}
HospitalList[3] = {ID: 3, Region: 3, Navn: 'Sjalland Hospital', Address: 'Example', Beds: 150, admitted: 0, eqp: 300}
HospitalList[4] = {ID: 4, Region: 4, Navn: 'Koebenhavn Hospital', Address: 'Example', Beds: 150, admitted: 0, eqp: 300}

let TravelTimeList = [];
TravelTimeList[0] = {from_region: 0, To_region: 0, min: 0}
TravelTimeList[1] = {from_region: 0, To_region: 1, min: 40}
TravelTimeList[2] = {from_region: 0, To_region: 2, min: 120}
TravelTimeList[3] = {from_region: 0, To_region: 3, min: 300}
TravelTimeList[4] = {from_region: 0, To_region: 4, min: 320}
TravelTimeList[5] = {from_region: 1, To_region: 0, min: 40}
TravelTimeList[6] = {from_region: 1, To_region: 1, min: 0}
TravelTimeList[7] = {from_region: 1, To_region: 2, min: 80}
TravelTimeList[8] = {from_region: 1, To_region: 3, min: 100}
TravelTimeList[9] = {from_region: 1, To_region: 4, min: 120}
TravelTimeList[10] = {from_region: 2, To_region: 0, min: 120}
TravelTimeList[11] = {from_region: 2, To_region: 1, min: 180}
TravelTimeList[12] = {from_region: 2, To_region: 2, min: 0}
TravelTimeList[13] = {from_region: 2, To_region: 3, min: 90}
TravelTimeList[14] = {from_region: 2, To_region: 4, min: 120}
TravelTimeList[15] = {from_region: 3, To_region: 0, min: 300}
TravelTimeList[16] = {from_region: 3, To_region: 1, min: 100}
TravelTimeList[17] = {from_region: 3, To_region: 2, min: 90}
TravelTimeList[18] = {from_region: 3, To_region: 3, min: 0}
TravelTimeList[19] = {from_region: 3, To_region: 4, min: 320}
TravelTimeList[20] = {from_region: 4, To_region: 0, min: 320}
TravelTimeList[21] = {from_region: 4, To_region: 1, min: 120}
TravelTimeList[22] = {from_region: 4, To_region: 2, min: 120}
TravelTimeList[23] = {from_region: 4, To_region: 3, min: 320}
TravelTimeList[24] = {from_region: 4, To_region: 4, min: 0}

function crowdedness(beds){
    if (beds > 0)
        return 1;
    else
        return 0;
}

// uses traveltimeList to find the shortest route and return the corresponding To_Region for the patient
function travel_Hospital(FromRegion, patient_grade){
    let shortest_route = 500;
    let Prefered_hospital = 0;
    for (index in TravelTimeList){
      TravelTime = TravelTimeList[index]
      if ((TravelTime.from_region == FromRegion) && (TravelTime.min<shortest_route) && (patient_grade > 0)){
        if (crowdedness(HospitalList[TravelTime.To_region].Beds) == 1){
          shortest_route = TravelTime.min;
          Prefered_hospital = TravelTime.To_region;
        }
      }
    }
    // if (patient_grade == 0){
    //   Prefered_hospital = FromRegion}
    return Prefered_hospital
}

function findPatient(Region, Lowergrading, New_Patient_List){
    for(index in New_Patient_List){
      if (New_Patient_List[index].region == Region && New_Patient_List[index].grading == grading )
        return index;
    }
  return "no";
}

function Admit(patientObj, New_Patient_List){
  let patientGrade = patientObj.grading;
  let patientRegion = patientObj.region;
  let NewRegion = 0;
  NewRegion = travel_Hospital(patientRegion, patientGrade)
  patientObj.region = NewRegion;
  if(TryReplace(patientRegion, patientGrade, New_Patient_List) == 1){
    let patientIndex = findPatient(NewRegion, patientGrade, New_Patient_List) 
  Admit(New_Patient_List[index], New_Patient_List)
  return New_Patient_List.splice(patientIndex, 1)
  }
  else
  New_Patient_List.push(patientObj);
  HospitalTracker(patientObj.region, patientGrade)
  return New_Patient_List
}

function TryReplace(FromRegion, patient_grade, New_Patient_List){
    let shortest_route = 500;
    let Prefered_hospital = 0;
    for (index in TravelTimeList){
      TravelTime = TravelTimeList[index]
      if ((TravelTime.from_region == FromRegion) && (TravelTime.min<shortest_route) && (patient_grade > 0)){
        if (crowdedness(HospitalList[TravelTime.To_region].Beds) == 0 && (patient_grade > LowestGradePatient(TravelTime.To_region, New_Patient_List))){
            shortest_route = TravelTime.min;
            Prefered_hospital = TravelTime.To_region;
            return 1;
        }
      }
    }
    return 0;
}

function LowestGradePatient(Region, New_Patient_List){
  let placeholder_grading = 5;
  for(index in New_Patient_List){
    if (New_Patient_List[index].grading <= placeholder_grading && New_Patient_List[index].region == Region){
      placeholder_grading == New_Patient_List[index].grading; 
    }
  }
  return placeholder_grading;
}


function ReplacePatient(newPatient, Region, New_Patient_List){
      admitPatient(regionArr[0], New_Patient_List)
      New_Patient_List.splice(0, 1, newPatient)
      if (PatientObj.grading == 0)
        HospitalList[Region].Beds += 1;
      if (Patientgrading == 3)
        HospitalList[Region].eqp += 1;
      regionPatientsReplace(newPatient)
      return New_Patient_List;
}

function HospitalTracker(region, PatientGrade){
    HospitalList[region].admitted += 1
    if (PatientGrade > 0)
      HospitalList[region].Beds -= 1
    if (PatientGrade == 3)
      HospitalList[region].eqp -= 1
  }

function BatchPatients(){
    let New_Patient_List = [];
    let Nr_patients = PatientList.length

    for(let i=0; i<Nr_patients; i++){
     New_Patient_List = Admit(PatientList[i], New_Patient_List)
    }

    for(index in HospitalList){
        console.log("hospital space = " + HospitalList[index].Beds);
        console.log("equipment = " + HospitalList[index].eqp);
    }
    console.log(HospitalList[0].admitted)
    console.log(HospitalList[1].admitted)
    console.log(HospitalList[2].admitted)
    console.log(HospitalList[3].admitted)
    console.log(HospitalList[4].admitted)
    
}   

BatchPatients();






// function regionPatients(){
//     // resets regioninventory (from region 1)
//     let k = 0, l = 0, m = 0, n = 0, p = 0;
 
//     // checks how many patients are in region 1, returns an "inventory" with a number of patients to be admitted in said region
 
//     for(index in PatientList){
//              if(0 == PatientList[index].region){
//                 Regiongradings[0][p] = PatientList[index].grading;
//                 p++
//              }
//              else if(1 == PatientList[index].region){
//                 Regiongradings[1][k] = PatientList[index].grading;
//                 k++
//              }
//              else if(2 == PatientList[index].region){
//                 Regiongradings[2][l] = PatientList[index].grading;
//                 l++
//              }
//              else if(3 == PatientList[index].region){
//                 Regiongradings[3][m] = PatientList[index].grading;
//                 m++;
//              }
//              else if(4 == PatientList[index].region){
//                 Regiongradings[4][n] = PatientList[index].grading;
//                 n++;
//              }
//      }   
//      console.log(Regiongradings[1])
// }
// regionPatients()

// function PutRegionPatients(PatientObj, region){
//   Regiongradings[region][Regiongradings[region].length + 1] = PatientObj.grading
// }

// function GetRegionPatients(grading, region){
//     for (index in Regiongradings[region]){
//       if (Regiongradings[region][index] == grading)
//         return index
//     }
//     return FALSE
// }



// Updates space and equipment usage in all 5 region hospitals, depending on admitted patient and grade lvl
// function admitPatient(){
//     let toRegion = 0;
//     let New_Patient_list = [];
//     Nr_patients = PatientList.length

//     for(let i=0; i<Nr_patients; i++){
//         toRegion = travel_Hospital(PatientList[i].region, PatientList[i].grading);
//         New_Patient_list.push({ region: toRegion, name: PatientList[i].Name, Grading: PatientList[i].grading});
//         HospitalList[toRegion].admitted += 1;
//         if (PatientList[i].grading > 0)
//           HospitalList[toRegion].Beds -= 1;
//         if (PatientList[i].grading > 1)
//           HospitalList[toRegion].eqp -= 1;
//     }
//     for(index in HospitalList){
//         console.log("hospital space = " + HospitalList[index].Beds);
//         console.log("equipment = " + HospitalList[index].eqp);
//     }
//     console.log(HospitalList[4].admitted);
//     console.log(New_Patient_list);
// }
