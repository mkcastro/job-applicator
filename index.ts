import * as fs from 'fs';
import dotenv from "dotenv"

dotenv.config()

const getKeywords = (): string[] => {
    const keywords = fs.readFileSync('./keywords.txt', 'utf8');

    return keywords.split('\n').filter(keyword => keyword.length > 0);
}

const getKeywordsFromJob = (): string[] => {
    const keywords = getKeywords();
    const job = fs.readFileSync('./job.txt', 'utf8');

    // convert the job.txt file to an array of words separated by either spaces or newlines
    const jobWords = job.split(/\s|\n/);

    // filter the jobWords array to only include the words that exist in the keywords array
    return keywords
        .filter(keyword => jobWords.includes(keyword))
        .filter((value, index, self) => self.indexOf(value) === index);
}

const generateCoverLetter = (): string => {
    const keywords = getKeywordsFromJob();
    const keywordsString = [
        // separate keywords with a comma and a single space
        keywords.slice(0, -1).join(', '),
        keywords.slice(-1)[0]
    ]
        // on the final item on the keywords array, prepend last item with "and"
        .join(keywords.length < 2 ? '' : ' and ')

    const recipientName = process.env.RECIPIENT_NAME;
    const position = process.env.POSITION;
    const reason = process.env.REASON;
    const experience = process.env.EXPERIENCE;
    const resumeLink = process.env.RESUME_LINK;
    const applicantName = process.env.APPLICANT_NAME;

    const result = `Dear ${recipientName},

I'm writing to inquire about the opening for ${position} ${reason}.

${experience}, making me a strong candidate for this position. I have strong skills in ${keywordsString}.

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
