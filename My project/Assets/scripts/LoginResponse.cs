using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class LoginResponse
{
    public int code;
    public string msg;
    public GameAccount data;

    public void Load(string jsonString)
    {
        JsonUtility.FromJsonOverwrite(jsonString, this);
    }
}
