const pup = require("puppeteer");
let {id,pass} = require("./secret");
let tab;
let dataFile = require("./data");


async function main(){
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"],
    });

    let pages = await browser.pages();
    tab = pages[0];
    await tab.goto("https://www.internshala.com/")
    await tab.click(".login-cta");
    await tab.type('#modal_email', id);
    await tab.type('#modal_password', pass); 
    await new Promise((resolve,reject)=>{
        return setTimeout(resolve,4000);
    })
    await tab.click('#modal_login_submit');

    await tab.waitForNavigation({waitUntil : "networkidle2"});
    await tab.click(".nav-link.dropdown-toggle.profile_container .is_icon_header.ic-24-filled-down-arrow");

    let profile_options = await tab.$$(".profile_options a");
    let app_urls = [];
    for(let i=0; i<11; i++){
       let url = await tab.evaluate(function(ele){
               return ele.getAttribute("href");                                 
       }, profile_options[i]); 
       app_urls.push(url);    
    }                                             

    tab.goto("https://internshala.com"+app_urls[3]);    
    await resume(dataFile[0]);

    await new Promise(function(resolve,reject){
        return setTimeout(resolve,1000);
    })

    await tab.goto("https://internshala.com/internships/");
    await application(dataFile[0]);

    await browser.close();
}

    async function resume(data){
        await tab.waitForSelector("#career-objective-form-modal", {visible : true});
        await tab.click("#career-objective-form-modal");
        await tab.waitForSelector("#career_objective_description", {visible : true});
        await tab.type("#career_objective_description", data["CareerObjective"]);
        await tab.click("#career-objective-submit");

        // await tab.waitForSelector("#internship", {visible : true})
        //await tab.click("#internship");
        // await tab.waitForSelector("#experience_profile", {visible : true});
        // await tab.type("#experience_profile", data["InternProfile"]);
        // await tab.type("#experience_organization", data["InternOrganization"]);
        // await tab.type("#experience_location", data["InternLocation"]);
        // await tab.click("#experience_start_date");
        // await tab.click("#ui-datepicker-div > table > tbody > tr:nth-child(1) > td:nth-child(1)");
        // await tab.click("#experience_end_date");
        // await tab.click("#ui-datepicker-div > table > tbody > tr:nth-child(3) > td:nth-child(1)");
        // await tab.click("#internship-job-submit");
        
        // await new Promise(function(resolve,reject){
            // return setTimeout(resolve,2000);
    //    }) 


        // await tab.waitForSelector("#training-resume", {visible : true});
        // await tab.click("#training-resume");
        // await tab.waitForSelector("#other_experiences_course", {visible : true});
        // await tab.type("#other_experiences_course", data["Training"]);
        // await tab.type("#other_experiences_organization", data["Organization"]);
        // await tab.type("#other_experiences_location", data["Location"]);
        // await tab.click("#other_experiences_start_date");
        // await tab.click("#ui-datepicker-div > table > tbody > tr:nth-child(1) > td:nth-child(1)");
        // await tab.click("#other_experiences_end_date");
        // await tab.click("#ui-datepicker-div > table > tbody > tr:nth-child(3) > td:nth-child(1)");
        // await tab.click("#training-submit");

        await new Promise(function(resolve,reject){
             return setTimeout(resolve,2000);
        })

        await tab.waitForSelector("#project-resume", {visible : true});
        await tab.click("#project-resume");
        await tab.waitForSelector("#other_experiences_title", {visible : true});
        await tab.type("#other_experiences_title", data["Project"]);
        await tab.click("#other_experiences_project_start_date");
        await tab.click("#ui-datepicker-div > table > tbody > tr:nth-child(1) > td:nth-child(1)");
        await tab.click("#other_experiences_project_end_date");
        await tab.click("#ui-datepicker-div > table > tbody > tr:nth-child(3) > td:nth-child(1)");       
        await tab.click("#project-submit");

    }   

    async function application(data){

        await tab.waitForSelector("#internship_list_container_1",{visible:true});
        await tab.click("#internship_list_container_1 > div > div > div.internship-heading-container")

        for (let i = 0; i < 5; i++) {
            const div = await tab.$("#internship_list_container_1 > div > div > div.internship-heading-container");
    
            // Perform click action
            await div.click();
            await new Promise(function(resolve,reject){                             
                return setTimeout(resolve, 2000);
            });

    
            await tab.waitForSelector("#continue_button",{visible:true});
            await tab.click("#continue_button") 
            
            await checkRequirements(tab,data);
            

            await tab.click("#submit");

            await tab.waitForSelector("#backToInternshipsCta > span",{visible:true});
            await tab.click("#backToInternshipsCta > span");

            await new Promise(function(resolve,reject){                             
                return setTimeout(resolve, 2000);
            });
        }
    }

    async function checkRequirements(tab,data){
        let hasAvailability = await tab.$('#check') !== null;
        let hasCoverLetter = await tab.$('#cover_letter_holder > div.ql-editor.ql-blank') !== null;
        let hasAssessment = await tab.$('.form-group.additional_question .textarea.form-control') !== null;


        if(hasAvailability){
            await tab.click("#check");
        }

        if(hasCoverLetter){
            await tab.type("#cover_letter_holder > div.ql-editor.ql-blank",data["hiringReason"]);   
        }

        if(hasAssessment){           
            const textAreas = await tab.$$('.form-group.additional_question .textarea.form-control');
            if (textAreas.length > 0) {
                await textAreas[0].type('Text for the first assesment');
            }
            if (textAreas.length > 1) {
                await textAreas[1].type('Text for the second assesment');
            }
        }
       
    }


main();
