let percentile_crowd = 0;
let percentile_medeqp = 0;
let travel_time1 = [0, 40, 120, 300, 320];
let travel_time2 = [0, 40, 80, 100, 120];
let travel_time3 = [0, 60, 70, 90, 120];
let travel_time4 = [0, 70, 100, 180, 320];
let travel_time5 = [0, 60, 180, 215, 280];

function crowdedness(admitted, beds){
    percentile_crowd = admitted/beds;
    if (percentile_crowd >= 0.60)
        return 0;
    else
        return 1;
}

function medeqpavl(admitted_medeqp, medeqp){
    percentile_medeqp = medeqp - admitted_medeqp;
    return percentile_medeqp;
}

function travel_distance(patient_region, admitted, beds, patient_grade){
    let region = [];
    let hospital_space = [];
    let hostpital_eqp = [];
    let patient_grade = [];
    let check_space = 0;
  
    if (patient_region === 1)
        for (index in travel_time1)
            region[index] = travel_time1[index];
    else if (patient_region === 2)
        for (index in travel_time2)
            region[index] = travel_time2[index];
    else if (patient_region === 3)
        for (index in travel_time3)
            region[index] = travel_time3[index];
    else if (patient_region === 4)
        for (index in travel_time4)
            region[index] = travel_time4[index];
    else if (patient_region === 5)
        for (index in travel_time5)
            region[index] = travel_time5[index];

    for(index in region)
        hospital_space[index] = crowdedness(admitted, beds)

    for(index in region)
        hostpital_eqp[index] = medeqp(admitted_medeqp, medeqp)
    
    for(index in region)
        patient_grade[index] = patient_grade[index];

    for(index in region){
        if(hostpital_eqp[index] > 0 && hostpital_space[index] === 1 && patient_grade < 3){
            hostpital_eqp[index] += 1;
            hostpital_space[index] += 1;
            break;
        }
    }

    for(index in hostpital_eqp)
        console.log("equipment =" + hostpital_eqp[index]);
        console.log("hospital space =" + hospital_space);    
}

function testfunktion(){
    admitted = 1000;
    patient_region = 1;
    beds = 5000;
    patient_grade = 1;

    for(i = 0; i < 999; i++)
        travel_distance(admitted, patient_region, beds, patient_grade);
}

