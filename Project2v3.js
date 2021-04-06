let percentile_crowd = 0;
let percentile_medeqp = 0;

let PatientList = [];
PatientList[0] = {Name: "Jeff", grading: 1, region: 4}
PatientList[1] = {Name: "Kebab", grading: 1, region: 2}
PatientList[2] = {Name: "Smurf", grading: 1, region: 2}
PatientList[3] = {Name: "Egon", grading: 1, region: 0}
PatientList[4] = {Name: "Andre", grading: 1, region: 3}
PatientList[5] = {Name: "Jeppe", grading: 1, region: 1}

let HospitalList = [0,0,0,0,0];
HospitalList[0] = {ID: 0, Region: 0, Navn: 'UniversetsHospital', Address: 'Example', Beds: 3000, admitted: 0, eqp: 300}
HospitalList[1] = {ID: 1, Region: 1, Navn: 'Midt Hospital', Address: 'Example', Beds: 3000, admitted: 0, eqp: 300}
HospitalList[2] = {ID: 2, Region: 2, Navn: 'Odense Hospital', Address: 'Example', Beds: 3000, admitted: 0, eqp: 300}
HospitalList[3] = {ID: 3, Region: 3, Navn: 'Sjalland Hospital', Address: 'Example', Beds: 3000, admitted: 0, eqp: 300}
HospitalList[4] = {ID: 4, Region: 4, Navn: 'Koebenhavn Hospital', Address: 'Example', Beds: 3000, admitted: 0, eqp: 300}

let regionList = [0,0,0,0,0];
regionList[0] = {number: 0, Name: 'Nord Jylland'}
regionList[1] = {number: 1, Name: 'Midt Jylland'}
regionList[2] = {number: 2, Name: 'Odense'}
regionList[3] = {number: 3, Name: 'Sjalland'}
regionList[4] = {number: 4, Name: 'Koebenhavn'}

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

function crowdedness(admitted, beds){
    percentile_crowd = admitted/beds;
    if (percentile_crowd >= 0.85)
        return 0;
    else
        return 1;
}

// uses traveltimeList to find the shortest route and return the corresponding To_Region
function travel_distance(FromRegion, patient_grade){
    let shortest_route = 500;
    let Prefered_hospital = 0;
    for (index in TravelTimeList){
      if ((TravelTimeList[index].from_region == FromRegion) && (TravelTimeList[index].min<shortest_route) && (patient_grade > 0))
      {
        if (crowdedness(HospitalList[TravelTimeList[index].To_region].admitted, HospitalList[TravelTimeList[index].To_region].Beds) == 1){
          shortest_route = TravelTimeList[index].min;
          console.log("shortest route: " + shortest_route)
          Prefered_hospital = TravelTimeList[index].To_region;
        }
      }
    }
    if (patient_grade == 0){
      Prefered_hospital = FromRegion}
    return Prefered_hospital
}

// Updates space and equipment usage in all 5 region hospitals, depending on admitted patient
function admitPatient(){
    let toRegion = 0;
    let New_Patient_list = [];
    Nr_patients = PatientList.length

    for(let i=0; i<Nr_patients; i++){
        toRegion = travel_distance(PatientList[i].region, PatientList[i].grading);
        New_Patient_list.push({ region: toRegion, name: PatientList[i].name, Grading: PatientList[i].grading});
        HospitalList[toRegion].admitted += 1;
        if (PatientList[i].grading > 0)
          HospitalList[toRegion].Beds -= 1;
        if (PatientList[i].grading > 0)
          HospitalList[toRegion].eqp -= 1;
    }

    for(index in HospitalList){
        console.log("hospital space = " + HospitalList[index].Beds);
        console.log("equipment = " + HospitalList[index].eqp);
    }
}
    admitPatient();