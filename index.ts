import * as fs from 'fs';
import dotenv from "dotenv"

dotenv.config()

const getSkills = (): string[] => {
    const skills = fs.readFileSync('./skills.txt', 'utf8');

    return skills
        .split('\n')
        .filter(skill => skill.length > 0);
}

const getSkillsFromJob = (): string[] => {
    const skills = getSkills();
    const jobDescription = fs.readFileSync('./job.txt', 'utf8');

    // convert the job.txt file to an array of words separated by either spaces or newlines
    const jobWords = jobDescription.split(/\s|\n/);

    // filter the jobWords array to only include the words that exist in the keywords array
    return skills
        .filter(skill => jobWords.includes(skill))
        .filter((value, index, self) => self.indexOf(value) === index);
}

const generateCoverLetter = (): string => {
    const skills = getSkillsFromJob();
    const skillsString = [
        // separate keywords with a comma and a single space
        skills.slice(0, -1).join(', '),
        skills.slice(-1)[0]
    ]
        // on the final item on the keywords array, prepend last item with "and"
        .join(skills.length < 2 ? '' : ' and ')

    const recipientName = process.env.RECIPIENT_NAME;
    const position = process.env.POSITION;
    const reason = process.env.REASON;
    const experience = process.env.EXPERIENCE;
    const resumeLink = process.env.RESUME_LINK;
    const applicantName = process.env.APPLICANT_NAME;

    const result = `Dear ${recipientName},

I'm writing to inquire about the opening for ${position} ${reason}.

${experience}, making me a strong candidate for this position. I have strong skills in ${skillsString}.

The top portion of my attached resume highlights my career profile and 3 significant accomplishments that are also in alignment with this position.

I'd welcome the opportunity to speak with you if you feel I'd be a strong candidate for this or any position in your organization.

${resumeLink}

Sincerely,

${applicantName}`;

    return result;
}

console.log(generateCoverLetter());

// write to output.txt the generated cover letter
fs.writeFileSync('./output.txt', generateCoverLetter());
