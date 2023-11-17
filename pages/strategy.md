# Strategy

# **Dialog Pipeline**

Transcription -> Dialog -> TTS

## **Transcription**

Using **whisper**, transcript user speech from any language to english.

Format it

## **Dialog**

Using **llama2-chat**, with the current context for the character, make the last transcription as entry point for the dialog.

llama2 prompt :

> [INST] <<SYS>> {{ system_prompt }} <</SYS>>
> 

> [INST]{{ user_message }} [/INST]
> 

<aside>
💡 This template aligns with the training procedure of the model, so it has a big impact on the quality of the output. In this template, ‘system_prompt’ represents the instructions or context for the model.

</aside>

The dialog will be in english, and the response will be in english. 

## **TTS**

Using the last response generated by the dialog, use the **TTS** to generate the audio (in english).

The best would be to have customs voice embedding for each characters.