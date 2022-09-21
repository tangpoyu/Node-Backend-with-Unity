using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;
using UnityEngine.Networking;
using System.Text.RegularExpressions;

public class Login : MonoBehaviour
{
    [SerializeField] private TMP_InputField username, password;
    [SerializeField] private Button loginButton, signUpButton;
    private GameAccount gameAccount;
    private const string PASSWORD_REGEX = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,24})";

    private void Awake()
    {
        loginButton.onClick.AddListener(() => StartCoroutine(TryLogin()));
        signUpButton.onClick.AddListener(() => StartCoroutine(TrySignUp()));
    }

    public IEnumerator TryLogin()
    {
        string username = this.username.text;
        string password = this.password.text;

        if (password == "" || username.Length < 8 || username.Length > 24 || !Regex.IsMatch(password, PASSWORD_REGEX))
        {
            Debug.Log("Invalid credentials.");
            yield break;
        }

        WWWForm form = new WWWForm();
        form.AddField("rusername", username);
        form.AddField("rpassword", password);
      
        
        using(UnityWebRequest request = UnityWebRequest.Post("http://localhost:12345/account/login", form))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                LoginResponse response = new LoginResponse();
                response.Load(request.downloadHandler.text);

                switch (response.code)
                {
                    case 0:
                        gameAccount = response.data;
                        Debug.Log($"Welcome !");
                        Debug.Log((gameAccount.permission == 1) ? "you are admin." : "");
                        break;

                    case -1:
                        Debug.Log("no input");
                        break;

                    case -2:
                        Debug.Log("Invalid credentials.");
                        break;

                    default:
                        Debug.Log("Corruption detected.");
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


        if (password == "" || username.Length < 8 || username.Length > 24 || !Regex.IsMatch(password, PASSWORD_REGEX))
        {
            Debug.Log("Invalid credentials.");
            yield break;
        }


        WWWForm form = new WWWForm();
        form.AddField("rusername", username);
        form.AddField("rpassword", password);


        using (UnityWebRequest request = UnityWebRequest.Post("http://localhost:12345/account/create", form))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                LoginResponse response = new LoginResponse();
                response.Load(request.downloadHandler.text);

                switch (response.code)
                {
                    case 0:
                        Debug.Log($"Welcome!");
                        Debug.Log((response.data.permission == 1) ? "you are admin." : "");
                        break;

                    case -1:
                        Debug.Log("no input");
                        break;

                    case -2:
                        Debug.Log("Invalid credentials.");
                        break;

                    case -3:
                        Debug.Log("Unsafe password.");
                        break;

                    default:
                        Debug.Log("Corruption detected.");
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
