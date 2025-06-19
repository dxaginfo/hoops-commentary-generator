document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const videoUpload = document.getElementById('video-upload');
    const videoPreview = document.getElementById('video-preview');
    const uploadPreviewContainer = document.getElementById('upload-preview');
    const nextStep1Btn = document.getElementById('next-step-1');
    const nextStep2Btn = document.getElementById('next-step-2');
    const nextStep3Btn = document.getElementById('next-step-3');
    const prevStep2Btn = document.getElementById('prev-step-2');
    const prevStep3Btn = document.getElementById('prev-step-3');
    const prevStep4Btn = document.getElementById('prev-step-4');
    const generateBtn = document.getElementById('generate-commentary');
    const generateSpinner = document.getElementById('generate-spinner');
    const commentaryResult = document.getElementById('commentary-result');
    const commentaryText = document.getElementById('commentary-text');
    const playCommentaryBtn = document.getElementById('play-commentary');
    const finalPreview = document.getElementById('final-preview');
    const downloadBtn = document.getElementById('download-video');
    const shareBtn = document.getElementById('share-video');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-percent');
    const generationStatus = document.getElementById('generation-status');
    const statusText = document.querySelector('.status-text');
    
    // Step navigation
    let currentStep = 1;
    let uploadedVideo = null;
    let generatedCommentary = null;
    let audioBlob = null;
    let finalVideoBlob = null;
    
    // Speech synthesis
    const synth = window.speechSynthesis;

    // Event Listeners
    videoUpload.addEventListener('change', handleVideoUpload);
    nextStep1Btn.addEventListener('click', () => goToStep(2));
    nextStep2Btn.addEventListener('click', () => goToStep(3));
    nextStep3Btn.addEventListener('click', () => goToStep(4));
    prevStep2Btn.addEventListener('click', () => goToStep(1));
    prevStep3Btn.addEventListener('click', () => goToStep(2));
    prevStep4Btn.addEventListener('click', () => goToStep(3));
    generateBtn.addEventListener('click', generateCommentary);
    playCommentaryBtn.addEventListener('click', playCommentary);
    downloadBtn.addEventListener('click', downloadVideo);
    shareBtn.addEventListener('click', shareVideo);

    // Upload area drag and drop
    const uploadArea = document.querySelector('.upload-area');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('border-orange-500');
        uploadArea.classList.add('bg-orange-50');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('border-orange-500');
        uploadArea.classList.remove('bg-orange-50');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('border-orange-500');
        uploadArea.classList.remove('bg-orange-50');
        
        if (e.dataTransfer.files.length) {
            handleVideoFile(e.dataTransfer.files[0]);
        }
    });

    // Functions
    function handleVideoUpload(e) {
        if (e.target.files.length) {
            handleVideoFile(e.target.files[0]);
        }
    }
    
    function handleVideoFile(file) {
        // Check if file is a video
        if (!file.type.startsWith('video/')) {
            showNotification('Please upload a video file', 'error');
            return;
        }
        
        // Check file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            showNotification('Video file is too large (max 50MB)', 'error');
            return;
        }
        
        uploadedVideo = file;
        
        // Create a URL for the video
        const videoURL = URL.createObjectURL(file);
        videoPreview.src = videoURL;
        uploadPreviewContainer.classList.remove('hidden');
        
        // Enable next button
        nextStep1Btn.disabled = false;
        
        showNotification('Video uploaded successfully!', 'success');
        
        // Load video metadata
        videoPreview.onloadedmetadata = () => {
            // Check if video is too long (max 30 seconds)
            if (videoPreview.duration > 30) {
                showNotification('Video is too long (max 30 seconds)', 'warning');
            }
        };
    }
    
    function goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show target step
        document.querySelector(`.step-content[data-step="${step}"]`).classList.add('active');
        
        // Update step indicators
        document.querySelectorAll('.step').forEach(el => {
            const stepNum = parseInt(el.getAttribute('data-step'));
            
            if (stepNum < step) {
                el.classList.add('completed');
                el.classList.remove('active');
            } else if (stepNum === step) {
                el.classList.add('active');
                el.classList.remove('completed');
            } else {
                el.classList.remove('active', 'completed');
            }
        });
        
        currentStep = step;
        
        // If going to final step, set up final preview
        if (step === 4 && uploadedVideo && generatedCommentary) {
            setupFinalPreview();
        }
    }
    
    function generateCommentary() {
        // Check if video is uploaded
        if (!uploadedVideo) {
            showNotification('Please upload a video first', 'error');
            return;
        }
        
        // Get form values
        const style = document.getElementById('commentary-style').value;
        const keywords = document.getElementById('keywords').value;
        
        // Show loading state
        generateBtn.disabled = true;
        generateSpinner.classList.remove('hidden');
        progressBar.classList.remove('hidden');
        statusText.textContent = 'Analyzing video...';
        
        // Simulate progress (in a real app, this would be based on actual progress)
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            if (progress > 100) {
                clearInterval(progressInterval);
                return;
            }
            
            progressFill.style.width = `${progress}%`;
            progressPercent.textContent = `${progress}%`;
            
            if (progress === 20) {
                statusText.textContent = 'Identifying basketball actions...';
            } else if (progress === 40) {
                statusText.textContent = 'Generating commentary...';
            } else if (progress === 70) {
                statusText.textContent = 'Creating audio...';
            } else if (progress === 90) {
                statusText.textContent = 'Finalizing...';
            }
        }, 200);
        
        // Simulate AI processing (would be a real API call in production)
        setTimeout(() => {
            clearInterval(progressInterval);
            progressFill.style.width = '100%';
            progressPercent.textContent = '100%';
            
            // Generate commentary based on style
            generatedCommentary = getCommentaryByStyle(style, keywords);
            
            // Show result
            commentaryResult.classList.remove('hidden');
            commentaryText.textContent = generatedCommentary;
            
            // Create speech
            createSpeech(generatedCommentary);
            
            // Update UI
            generateBtn.disabled = false;
            generateSpinner.classList.add('hidden');
            generateBtn.classList.add('hidden');
            nextStep3Btn.classList.remove('hidden');
            statusText.textContent = 'Commentary generated successfully!';
            
            showNotification('Commentary generated!', 'success');
        }, 4000);
    }
    
    function getCommentaryByStyle(style, keywords) {
        // This would be AI-generated in a real app
        const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        
        // Sample commentaries based on style
        const commentaries = {
            excitable: [
                "OH MY GOODNESS! What a SPECTACULAR move we just witnessed! The defender had NO CHANCE as {player} executed that crossover to perfection! And then the ELEVATION on the jump shot! NOTHING BUT THE BOTTOM OF THE NET! That's what basketball is all about, folks!",
                "UNBELIEVABLE! Did you see that?! The way {player} attacked the rim was ABSOLUTELY FEROCIOUS! That's a POSTER DUNK if I've ever seen one! The defender is going to need therapy after being on the wrong end of that highlight! THIS PLACE IS GOING CRAZY!",
                "WOW! Talk about CLUTCH! Ice water in those veins! With the game on the line, {player} steps up and delivers when it matters most! That's the mark of a TRUE COMPETITOR! What a moment! What a player! What a GAME!"
            ],
            analytical: [
                "Excellent footwork here from {player}. Notice how they create separation with that hesitation move, establishing the right angle for the drive. The defender overcommits slightly, leaving just enough space for a clean look at the basket. That's fundamentally sound basketball.",
                "This is a textbook example of how to execute in transition. The ball handler maintains proper spacing, draws the defender, and makes a perfectly timed pass. The shooting percentage increases dramatically with this kind of uncontested attempt. Very efficient offensive sequence.",
                "Watch the defensive rotation here - it breaks down when the help-side defender steps too far into the paint. This creates the opening for the skip pass to the corner, where the shooter has set their feet perfectly. The 45-degree angle on that release is optimal for consistency."
            ],
            oldschool: [
                "That's old-school basketball right there, partner. {Player} is showing us what happens when you perfect your craft in the gym when nobody's watching. That's not flashy, that's FUNDAMENTALS. The kind of move that would make the legends of the game proud.",
                "You don't see that kind of post-up game anymore, folks. Back to the basket, patient footwork, using the body to create space. That's how they played in the golden era. No fancy gimmicks needed when you've mastered the basics like {player} clearly has.",
                "Now THAT'S how you defend! Moving the feet, active hands, contesting without fouling. In my day, that's what every coach demanded. None of this switching everything nonsense. Man-to-man defense the way Dr. Naismith intended when he hung up that peach basket!"
            ]
        };
        
        // Select random commentary from the chosen style
        let commentary = commentaries[style][Math.floor(Math.random() * commentaries[style].length)];
        
        // Insert a random player name or use keyword if available
        const playerNames = ["Johnson", "Williams", "Davis", "Smith", "Jordan", "Miller", "Thompson"];
        const playerName = keywordsArray.find(k => k.length > 3) || playerNames[Math.floor(Math.random() * playerNames.length)];
        commentary = commentary.replace(/{player}/gi, playerName);
        
        // Insert keywords if any
        if (keywordsArray.length > 0) {
            // Add a sentence mentioning one of the keywords
            const keyword = keywordsArray[Math.floor(Math.random() * keywordsArray.length)];
            const keywordSentences = [
                ` That ${keyword} move is becoming their signature!`,
                ` You can see why they're known for their ${keyword} ability.`,
                ` That's what we call ${keyword} basketball!`
            ];
            commentary += keywordSentences[Math.floor(Math.random() * keywordSentences.length)];
        }
        
        return commentary;
    }
    
    function createSpeech(text) {
        // Stop any current speech
        if (synth.speaking) {
            synth.cancel();
        }
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set properties
        utterance.rate = 1.1; // Slightly faster than normal
        utterance.pitch = 1.2; // Slightly higher pitch
        utterance.volume = 1;
        
        // Get voices
        let voices = synth.getVoices();
        
        // Use a male voice if available
        const preferredVoice = voices.find(voice => 
            voice.name.includes('Male') || 
            voice.name.includes('Guy') || 
            voice.name.includes('Daniel')
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Store the audio for later playback
        // Note: Web Speech API doesn't easily allow saving the audio
        // In a real app, we'd use a TTS service that returns audio files
        
        return utterance;
    }
    
    function playCommentary() {
        if (!generatedCommentary) return;
        
        // Create and play the speech
        const utterance = createSpeech(generatedCommentary);
        synth.speak(utterance);
        
        // Update button
        playCommentaryBtn.innerHTML = '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 9v6l5-3-5-3z"></path></svg> Playing...';
        
        utterance.onend = () => {
            playCommentaryBtn.innerHTML = '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"></path></svg> Play Audio';
        };
    }
    
    function setupFinalPreview() {
        // Set video source
        finalPreview.src = videoPreview.src;
        
        // In a real app, we would combine the video with the audio commentary
        // For this demo, we'll just play the original video
    }
    
    function downloadVideo() {
        // In a real app, this would download the video with commentary
        // For this demo, we'll just download the original video
        
        if (!uploadedVideo) return;
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(uploadedVideo);
        a.download = 'basketball-with-commentary.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('Video downloaded successfully!', 'success');
    }
    
    function shareVideo() {
        // This would use the Web Share API in a real app
        // For this demo, we'll just show a notification
        
        if (navigator.share && uploadedVideo) {
            navigator.share({
                title: 'Basketball Play with Commentary',
                text: 'Check out this basketball play with AI-generated commentary!',
                // In a real app, we would have a URL to the shared content
                url: window.location.href
            })
            .then(() => showNotification('Shared successfully!', 'success'))
            .catch(err => showNotification('Error sharing: ' + err.message, 'error'));
        } else {
            showNotification('Sharing is not supported on this browser', 'warning');
        }
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        // Set message
        notificationText.textContent = message;
        
        // Set color based on type
        if (type === 'error') {
            notification.classList.remove('bg-gray-800', 'bg-green-600', 'bg-yellow-500');
            notification.classList.add('bg-red-600');
        } else if (type === 'success') {
            notification.classList.remove('bg-gray-800', 'bg-red-600', 'bg-yellow-500');
            notification.classList.add('bg-green-600');
        } else if (type === 'warning') {
            notification.classList.remove('bg-gray-800', 'bg-red-600', 'bg-green-600');
            notification.classList.add('bg-yellow-500');
        } else {
            notification.classList.remove('bg-red-600', 'bg-green-600', 'bg-yellow-500');
            notification.classList.add('bg-gray-800');
        }
        
        // Show notification
        notification.classList.remove('translate-y-24');
        notification.classList.add('translate-y-0');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('translate-y-0');
            notification.classList.add('translate-y-24');
        }, 3000);
    }
});