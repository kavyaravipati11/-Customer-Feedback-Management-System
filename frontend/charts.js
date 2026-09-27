async function loadCharts() {

    const response = await fetch("http://localhost:5000/api/feedback");

    const data = await response.json();

    let positive = 0;
    let negative = 0;
    let neutral = 0;

    const productCounts = {};

    data.forEach(item => {

        if(item.sentiment === "Positive")
            positive++;

        else if(item.sentiment === "Negative")
            negative++;

        else
            neutral++;

        if(productCounts[item.product_id]){

            productCounts[item.product_id]++;

        }else{

            productCounts[item.product_id] = 1;

        }

    });

    // Pie Chart
    new Chart(document.getElementById("pieChart"),{

        type:"pie",

        data:{

            labels:["Positive","Negative","Neutral"],

            datasets:[{

                data:[positive,negative,neutral]

            }]

        }

    });

    // Bar Chart
    new Chart(document.getElementById("barChart"),{

        type:"bar",

        data:{

            labels:Object.keys(productCounts),

            datasets:[{

                label:"Feedback Count",

                data:Object.values(productCounts)

            }]

        }

    });

}

loadCharts();