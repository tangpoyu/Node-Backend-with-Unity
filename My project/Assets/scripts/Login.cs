using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;
using UnityEngine.Networking;

public class Login : MonoBehaviour
{
    [SerializeField] private TMP_InputField username, password;
    [SerializeField] private Button loginButton, signUpButton;
    private GameAccount gameAccount;

    private void Awake()
    {
        loginButton.onClick.AddListener(() => StartCoroutine(TryLogin()));
        signUpButton.onClick.AddListener(() => StartCoroutine(TrySignUp()));
    }

    public IEnumerator TryLogin()
    {
        string username = this.username.text;
        string password = this.password.text;

        WWWForm form = new WWWForm();
        form.AddField("rusername", username);
        form.AddField("rpassword", password);
      
        
        using(UnityWebRequest request = UnityWebRequest.Post("http://localhost:12345/account/login", form))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                switch (request.downloadHandler.text)
                {
                    case "-1":
                        Debug.Log("no input");
                        break;

                    case "-2":
                        Debug.Log("password or username error");
                        break;

                    default:
                        gameAccount = new GameAccount();
                        gameAccount.Load(request.downloadHandler.text);
                        Debug.Log($"Welcome {gameAccount.username}! your id is : {gameAccount._id}.");
                        Debug.Log((gameAccount.adminFlag == 1)? "you are admin." : "");
                        break;
                }
             
            }
            else
            {
                Debug.Log(request.error);
            }
            
        }
    }

    public IEnumerator TrySignUp()
    {
        string username = this.username.text;
        string password = this.password.text;

        WWWForm form = new WWWForm();
        form.AddField("rusername", username);
        form.AddField("rpassword", password);


        using (UnityWebRequest request = UnityWebRequest.Post("http://localhost:12345/account/create", form))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                switch (request.downloadHandler.text)
                {
                    case "-1":
                        Debug.Log("no input");
                        break;

                    case "-2":
                        Debug.Log("This username is taken.");
                        break;

                    default:
                        gameAccount = new GameAccount();
                        gameAccount.Load(request.downloadHandler.text);
                        Debug.Log($"Welcome {gameAccount.username}! your id is : {gameAccount._id}.");
                        Debug.Log((gameAccount.adminFlag == 1) ? "you are admin." : "");
                        break;
                }

            }
            else
            {
                Debug.Log(request.error);
            }

        }
    }
}
